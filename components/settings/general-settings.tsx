"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ImageUp, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, fieldAria } from "@/components/shared/form-field";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { resetDemoData, updateSettings } from "@/lib/store/app-store";
import type { Language, WorkspaceSettings } from "@/lib/types";
import { SettingsSection } from "./settings-section";

const TIMEZONES = ["Asia/Dhaka", "Asia/Kolkata", "Asia/Dubai", "Europe/London", "America/New_York", "UTC"];
const LANGUAGES: { value: Language; label: string }[] = [
  { value: "auto", label: "Match customer" },
  { value: "bn", label: "Bengali" },
  { value: "en", label: "English" },
  { value: "banglish", label: "Banglish" },
];
const MAX_LOGO_BYTES = 512 * 1024;

const schema = z.object({
  workspaceName: z.string().trim().min(2, "Workspace name must be at least 2 characters").max(40, "Keep it under 40 characters"),
  timezone: z.string(),
  defaultLanguage: z.enum(["auto", "bn", "en", "banglish"]),
});

type FormValues = z.infer<typeof schema>;

export function GeneralSettings({ settings }: { settings: WorkspaceSettings["general"] }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      workspaceName: settings.workspaceName,
      timezone: settings.timezone,
      defaultLanguage: settings.defaultLanguage,
    },
  });

  function onSubmit(values: FormValues) {
    updateSettings("general", { ...settings, ...values });
    reset(values);
    toast.success("Workspace settings saved");
  }

  function handleLogo(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast.error("Logo must be smaller than 512 KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateSettings("general", { ...settings, logoDataUrl: String(reader.result) });
      toast.success("Logo updated", { description: "Stored in this browser only." });
    };
    reader.onerror = () => toast.error("Couldn't read that file");
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <SettingsSection
          title="Workspace"
          description="Basic details for your workspace."
          footer={
            <>
              <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty}>
                Discard
              </Button>
              <Button type="submit" disabled={!isDirty}>
                Save changes
              </Button>
            </>
          }
        >
          <div className="grid gap-5">
            <div className="flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border bg-primary text-xl font-semibold text-primary-foreground">
                {settings.logoDataUrl ? (
                  <Image src={settings.logoDataUrl} alt="Workspace logo" width={64} height={64} unoptimized className="size-full object-cover" />
                ) : (
                  settings.workspaceName.slice(0, 2).toUpperCase()
                )}
              </span>
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                    <ImageUp /> Upload logo
                  </Button>
                  {settings.logoDataUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        updateSettings("general", { ...settings, logoDataUrl: null });
                        toast.success("Logo removed");
                      }}
                    >
                      <Trash2 /> Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">PNG, JPG or SVG, up to 512 KB.</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  aria-hidden="true"
                  tabIndex={-1}
                  onChange={(e) => {
                    handleLogo(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
            <FormField label="Workspace name" htmlFor="ws-name" error={errors.workspaceName?.message}>
              <Input {...fieldAria("ws-name", errors.workspaceName?.message)} {...register("workspaceName")} className="max-w-md" />
            </FormField>
            <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
              <FormField label="Business timezone" htmlFor="ws-tz">
                <Controller
                  control={control}
                  name="timezone"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="ws-tz" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField label="Default language" htmlFor="ws-lang">
                <Controller
                  control={control}
                  name="defaultLanguage"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="ws-lang" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l.value} value={l.value}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>
          </div>
        </SettingsSection>
      </form>

      <SettingsSection title="Demo data" description="Settings are saved in this browser's local storage.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">Restore all sample data and clear saved preferences.</p>
          <Button variant="destructive" onClick={() => setResetOpen(true)}>
            <RotateCcw /> Reset demo data
          </Button>
        </div>
      </SettingsSection>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset demo data?"
        description="All changes you've made — settings, contacts, products, automations, and integrations — will return to the original sample data."
        confirmLabel="Reset"
        onConfirm={() => {
          resetDemoData();
          setResetOpen(false);
          toast.success("Demo data restored");
        }}
      />
    </div>
  );
}
