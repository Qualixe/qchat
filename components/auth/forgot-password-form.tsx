"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, fieldAria } from "@/components/shared/form-field";
import { mockRequestPasswordReset } from "@/lib/auth/mock-auth";
import { FormAlert } from "./form-alert";

const schema = z.object({ email: z.email("Enter a valid email address") });
type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  async function onSubmit({ email }: FormValues) {
    setError(null);
    try {
      await mockRequestPasswordReset(email);
      setSentTo(email);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted-foreground">Enter your email and we&apos;ll show you the next step.</p>
      </div>

      {sentTo ? (
        <FormAlert tone="success">
          <p className="font-medium">Request received for {sentTo}</p>
          <p className="mt-1">
            Password recovery isn&apos;t operational in this demo, so no email was sent. In production, a reset link would
            arrive in your inbox.
          </p>
        </FormAlert>
      ) : (
        <>
          {error && <FormAlert tone="error">{error}</FormAlert>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField label="Email" htmlFor="fp-email" error={errors.email?.message}>
              <Input type="email" autoComplete="email" {...fieldAria("fp-email", errors.email?.message)} {...register("email")} />
            </FormField>
            <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {isSubmitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        </>
      )}

      <Button variant="ghost" className="w-full" asChild>
        <Link href="/login">
          <ArrowLeft /> Back to log in
        </Link>
      </Button>
    </div>
  );
}
