"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Download, Filter, MoreHorizontal, Pencil, Plus, Trash2, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer, PageIntro } from "@/components/shared/page-intro";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge, TagBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Pagination, paginate } from "@/components/shared/pagination";
import { CONTACT_STATUS } from "@/components/shared/status-maps";
import { CONTACT_TAGS } from "@/lib/mock-data/contacts";
import { deleteContact, useAppStore } from "@/lib/store/app-store";
import { formatCurrency, formatRelative } from "@/lib/format";
import { downloadCsv, toCsv } from "@/lib/csv";
import type { Contact, ContactStatus } from "@/lib/types";
import { ContactDetailsSheet } from "./contact-details-sheet";
import { ContactFormDialog } from "./contact-form-dialog";

const PAGE_SIZE = 8;

/** Reads deep-link params (?q=, ?new=1) and re-mounts the view when they change. */
export function ContactsPage() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const startAdding = params.get("new") === "1";
  return <ContactsView key={`${q}|${startAdding}`} initialQuery={q} startAdding={startAdding} />;
}

function ContactsView({ initialQuery, startAdding }: { initialQuery: string; startAdding: boolean }) {
  const contacts = useAppStore((s) => s.contacts);
  const [search, setSearch] = useState(initialQuery);
  const [status, setStatus] = useState<ContactStatus | "all">("all");
  const [tags, setTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(startAdding);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Contact | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (tags.length && !tags.some((t) => c.tags.includes(t))) return false;
      if (!q) return true;
      return [c.name, c.email, c.phone, c.location].some((v) => v.toLowerCase().includes(q));
    });
  }, [contacts, search, status, tags]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = paginate(filtered, currentPage, PAGE_SIZE);
  const details = contacts.find((c) => c.id === detailsId) ?? null;
  const filtersActive = status !== "all" || tags.length > 0 || search.trim() !== "";

  function resetPage<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function exportCsv() {
    const csv = toCsv(
      ["Name", "Email", "Phone", "Location", "Status", "Tags", "Last contacted", "Conversations", "Orders", "Lifetime value (BDT)"],
      filtered.map((c) => [
        c.name,
        c.email,
        c.phone,
        c.location,
        CONTACT_STATUS[c.status].label,
        c.tags.join("; "),
        c.lastContactedAt,
        c.totalConversations,
        c.totalOrders,
        c.lifetimeValue,
      ]),
    );
    if (downloadCsv("qchat-contacts.csv", csv)) {
      toast.success(`Exported ${filtered.length} contacts`);
    } else {
      toast.error("Your browser blocked the download");
    }
  }

  function openEdit(contact: Contact) {
    setEditing(contact);
    setFormOpen(true);
  }

  return (
    <PageContainer>
      <PageIntro
        description="Every customer and lead who has messaged your store."
        actions={
          <>
            <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
              <Download /> Export CSV
            </Button>
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus /> Add contact
            </Button>
          </>
        }
      />

      <Card className="gap-0 py-0">
        <div className="flex flex-col gap-2 border-b p-3 md:flex-row md:items-center">
          <SearchInput
            value={search}
            onChange={resetPage(setSearch)}
            label="Search contacts"
            placeholder="Search name, email, phone…"
            className="md:w-72"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={status} onValueChange={(v) => resetPage(setStatus)(v as ContactStatus | "all")}>
              <SelectTrigger className="w-36" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {(Object.keys(CONTACT_STATUS) as ContactStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {CONTACT_STATUS[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter /> Tags
                  {tags.length > 0 && (
                    <span className="rounded bg-primary px-1 text-[10px] text-primary-foreground">{tags.length}</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Show contacts with any of</DropdownMenuLabel>
                {CONTACT_TAGS.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={tags.includes(tag)}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(checked) =>
                      resetPage(setTags)(checked ? [...tags, tag] : tags.filter((t) => t !== tag))
                    }
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
                {tags.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => resetPage(setTags)([])}>Clear tags</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {filtersActive && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setStatus("all");
                  setTags([]);
                  setPage(1);
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={contacts.length ? UserRound : Users}
            title={contacts.length ? "No contacts match your filters" : "No contacts yet"}
            description={contacts.length ? "Try clearing filters or searching for something else." : "Add your first contact to get started."}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="pl-4">Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last contacted</TableHead>
                  <TableHead className="text-right">Conversations</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="w-10 pr-4">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((contact) => (
                  <TableRow key={contact.id} className="cursor-pointer" onClick={() => setDetailsId(contact.id)}>
                    <TableCell className="pl-4">
                      <button
                        type="button"
                        className="flex items-center gap-3 rounded text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailsId(contact.id);
                        }}
                      >
                        <UserAvatar initials={contact.initials} colorClassName={contact.avatarColor} size="sm" />
                        <span className="min-w-0">
                          <span className="block font-medium">{contact.name}</span>
                          <span className="block text-xs text-muted-foreground">{contact.email}</span>
                        </span>
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">{contact.phone}</TableCell>
                    <TableCell>
                      <div className="flex max-w-48 flex-wrap gap-1">
                        {contact.tags.length ? contact.tags.map((t) => <TagBadge key={t}>{t}</TagBadge>) : <span className="text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={CONTACT_STATUS[contact.status].tone} dot>
                        {CONTACT_STATUS[contact.status].label}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatRelative(contact.lastContactedAt)}</TableCell>
                    <TableCell className="text-right tabular-nums">{contact.totalConversations}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {contact.totalOrders}
                      <span className="block text-[11px] text-muted-foreground">{formatCurrency(contact.lifetimeValue)}</span>
                    </TableCell>
                    <TableCell className="pr-4" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${contact.name}`}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => setDetailsId(contact.id)}>
                            <UserRound /> View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => openEdit(contact)}>
                            <Pencil /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(contact)}>
                            <Trash2 /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <Pagination page={currentPage} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} itemLabel="contacts" />
      </Card>

      <ContactFormDialog open={formOpen} onOpenChange={setFormOpen} contact={editing} />
      <ContactDetailsSheet
        contact={details}
        onOpenChange={(open) => !open && setDetailsId(null)}
        onEdit={(c) => {
          setDetailsId(null);
          openEdit(c);
        }}
        onDelete={(c) => setDeleting(c)}
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete contact?"
        description={
          <>
            <strong>{deleting?.name}</strong> and their details will be removed from this workspace. This can&apos;t be undone.
          </>
        }
        onConfirm={() => {
          if (!deleting) return;
          deleteContact(deleting.id);
          if (detailsId === deleting.id) setDetailsId(null);
          toast.success("Contact deleted", { description: deleting.name });
          setDeleting(null);
        }}
      />
    </PageContainer>
  );
}
