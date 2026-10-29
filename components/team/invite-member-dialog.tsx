"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField, fieldAria } from "@/components/shared/form-field";
import { ROLE_LABELS } from "@/components/shared/status-maps";
import { inviteMember, useAppStore } from "@/lib/store/app-store";
import type { TeamRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const INVITABLE_ROLES: TeamRole[] = ["admin", "agent", "viewer"];

const schema = z.object({
  name: z.string().trim().min(2, "Enter their name"),
  email: z.email("Enter a valid email address"),
  role: z.enum(["admin", "agent", "viewer"]),
});

type FormValues = z.infer<typeof schema>;

export function InviteMemberDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const team = useAppStore((s) => s.team);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", role: "agent" } });

  useEffect(() => {
    if (open) reset({ name: "", email: "", role: "agent" });
  }, [open, reset]);

  function onSubmit(values: FormValues) {
    if (team.some((m) => m.email.toLowerCase() === values.email.toLowerCase())) {
      setError("email", { message: "This person is already on your team" });
      return;
    }
    inviteMember(values);
    toast.success(`Invitation created for ${values.name}`, { description: "Demo only — no email was sent." });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite teammate</DialogTitle>
          <DialogDescription>They&apos;ll appear as invited. No email is sent in this demo.</DialogDescription>
        </DialogHeader>
        <form id="invite-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <FormField label="Name" htmlFor="inv-name" error={errors.name?.message}>
            <Input {...fieldAria("inv-name", errors.name?.message)} {...register("name")} />
          </FormField>
          <FormField label="Email" htmlFor="inv-email" error={errors.email?.message}>
            <Input type="email" {...fieldAria("inv-email", errors.email?.message)} {...register("email")} />
          </FormField>
          <fieldset>
            <legend className="mb-2 text-[13px] font-medium">Role</legend>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-2">
                  {INVITABLE_ROLES.map((role) => (
                    <Label
                      key={role}
                      htmlFor={`role-${role}`}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-muted/50",
                        field.value === role && "border-primary/40 bg-accent/60",
                      )}
                    >
                      <RadioGroupItem id={`role-${role}`} value={role} className="mt-0.5" />
                      <span>
                        <span className="block text-[13px] font-medium">{ROLE_LABELS[role].label}</span>
                        <span className="block text-xs font-normal text-muted-foreground">{ROLE_LABELS[role].description}</span>
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
          </fieldset>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="invite-form">
            <Send /> Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
