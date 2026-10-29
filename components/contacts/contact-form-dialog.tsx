"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, fieldAria } from "@/components/shared/form-field";
import { CHANNEL_META } from "@/components/shared/brand-icons";
import { CONTACT_STATUS } from "@/components/shared/status-maps";
import { CONTACT_TAGS } from "@/lib/mock-data/contacts";
import { addContact, updateContact } from "@/lib/store/app-store";
import type { ChannelId, Contact, ContactStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter the customer's full name"),
  email: z.email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,20}$/, "Enter a valid phone number, e.g. +880 1711-234567"),
  location: z.string().trim().max(80, "Keep the location under 80 characters"),
  status: z.enum(["active", "lead", "vip", "inactive"]),
  channel: z.enum(["messenger", "instagram", "whatsapp", "webchat"]),
  tags: z.array(z.string()),
  notes: z.string().max(500, "Notes can be up to 500 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const EMPTY: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  location: "",
  status: "lead",
  channel: "messenger",
  tags: [],
  notes: "",
};

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits this contact; otherwise it creates one. */
  contact?: Contact | null;
}

export function ContactFormDialog({ open, onOpenChange, contact }: ContactFormDialogProps) {
  const isEdit = Boolean(contact);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema), defaultValues: EMPTY });

  useEffect(() => {
    if (!open) return;
    reset(
      contact
        ? {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            location: contact.location,
            status: contact.status,
            channel: contact.channel,
            tags: contact.tags,
            notes: contact.notes,
          }
        : EMPTY,
    );
  }, [open, contact, reset]);

  function onSubmit(values: ContactFormValues) {
    if (contact) {
      updateContact(contact.id, values);
      toast.success("Contact updated", { description: values.name });
    } else {
      addContact(values);
      toast.success("Contact added", { description: values.name });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit contact" : "Add contact"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this customer's details." : "Add a customer or lead to your workspace."}
          </DialogDescription>
        </DialogHeader>

        <form id="contact-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <FormField label="Full name" htmlFor="contact-name" error={errors.name?.message}>
            <Input {...fieldAria("contact-name", errors.name?.message)} {...register("name")} autoComplete="off" />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Email" htmlFor="contact-email" error={errors.email?.message}>
              <Input
                type="email"
                {...fieldAria("contact-email", errors.email?.message)}
                {...register("email")}
                autoComplete="off"
              />
            </FormField>
            <FormField label="Phone" htmlFor="contact-phone" error={errors.phone?.message}>
              <Input
                type="tel"
                {...fieldAria("contact-phone", errors.phone?.message)}
                {...register("phone")}
                autoComplete="off"
              />
            </FormField>
          </div>
          <FormField label="Location" htmlFor="contact-location" error={errors.location?.message} optional>
            <Input {...fieldAria("contact-location", errors.location?.message)} {...register("location")} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Status" htmlFor="contact-status">
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => field.onChange(v as ContactStatus)}>
                    <SelectTrigger id="contact-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(CONTACT_STATUS) as ContactStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {CONTACT_STATUS[s].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Primary channel" htmlFor="contact-channel">
              <Controller
                control={control}
                name="channel"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => field.onChange(v as ChannelId)}>
                    <SelectTrigger id="contact-channel" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(CHANNEL_META) as ChannelId[]).map((c) => (
                        <SelectItem key={c} value={c}>
                          {CHANNEL_META[c].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
          <fieldset className="grid gap-1.5">
            <legend className="mb-1.5 text-[13px] font-medium">Tags</legend>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <div className="flex flex-wrap gap-1.5">
                  {CONTACT_TAGS.map((tag) => {
                    const selected = field.value.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          field.onChange(selected ? field.value.filter((t) => t !== tag) : [...field.value, tag])
                        }
                        className={cn(
                          "h-7 rounded-md border px-2 text-xs font-medium transition-colors",
                          selected
                            ? "border-primary/30 bg-accent text-accent-foreground"
                            : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </fieldset>
          <FormField label="Notes" htmlFor="contact-notes" error={errors.notes?.message} optional>
            <Textarea rows={3} {...fieldAria("contact-notes", errors.notes?.message)} {...register("notes")} />
          </FormField>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="contact-form" disabled={isSubmitting}>
            {isEdit ? "Save changes" : "Add contact"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
