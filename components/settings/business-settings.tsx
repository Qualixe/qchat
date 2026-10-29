"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, fieldAria } from "@/components/shared/form-field";
import { updateSettings } from "@/lib/store/app-store";
import type { WorkspaceSettings } from "@/lib/types";
import { SettingsSection } from "./settings-section";

const schema = z.object({
  businessName: z.string().trim().min(2, "Enter your business name"),
  description: z.string().max(300, "Keep the description under 300 characters"),
  website: z.union([z.literal(""), z.url("Enter a full URL, e.g. https://example.com")]),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{7,20}$/, "Enter a valid phone number"),
  address: z.string().max(200, "Keep the address under 200 characters"),
  deliveryPolicy: z.string().trim().min(10, "Describe your delivery policy").max(800, "Keep it under 800 characters"),
  returnPolicy: z.string().trim().min(10, "Describe your return policy").max(800, "Keep it under 800 characters"),
});

type FormValues = z.infer<typeof schema>;

export function BusinessSettings({ settings }: { settings: WorkspaceSettings["business"] }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: settings });

  function onSubmit(values: FormValues) {
    updateSettings("business", values);
    reset(values);
    toast.success("Business profile saved", { description: "The AI assistant will use these details." });
  }

  const err = (key: keyof FormValues) => errors[key]?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <SettingsSection
        title="Business profile"
        description="Shared with your AI assistant so it can answer accurately."
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
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Business name" htmlFor="biz-name" error={err("businessName")}>
              <Input {...fieldAria("biz-name", err("businessName"))} {...register("businessName")} />
            </FormField>
            <FormField label="Website" htmlFor="biz-web" error={err("website")} optional>
              <Input type="url" {...fieldAria("biz-web", err("website"))} {...register("website")} placeholder="https://" />
            </FormField>
          </div>
          <FormField label="Description" htmlFor="biz-desc" error={err("description")} optional>
            <Textarea rows={2} {...fieldAria("biz-desc", err("description"))} {...register("description")} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Contact email" htmlFor="biz-email" error={err("email")}>
              <Input type="email" {...fieldAria("biz-email", err("email"))} {...register("email")} />
            </FormField>
            <FormField label="Contact phone" htmlFor="biz-phone" error={err("phone")}>
              <Input type="tel" {...fieldAria("biz-phone", err("phone"))} {...register("phone")} />
            </FormField>
          </div>
          <FormField label="Address" htmlFor="biz-address" error={err("address")} optional>
            <Input {...fieldAria("biz-address", err("address"))} {...register("address")} />
          </FormField>
          <div className="grid gap-4 lg:grid-cols-2">
            <FormField label="Delivery policy" htmlFor="biz-delivery" error={err("deliveryPolicy")}>
              <Textarea rows={4} {...fieldAria("biz-delivery", err("deliveryPolicy"))} {...register("deliveryPolicy")} />
            </FormField>
            <FormField label="Return policy" htmlFor="biz-return" error={err("returnPolicy")}>
              <Textarea rows={4} {...fieldAria("biz-return", err("returnPolicy"))} {...register("returnPolicy")} />
            </FormField>
          </div>
        </div>
      </SettingsSection>
    </form>
  );
}
