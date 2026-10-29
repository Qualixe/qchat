"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, fieldAria } from "@/components/shared/form-field";
import { mockSignUp } from "@/lib/auth/mock-auth";
import { FormAlert } from "./form-alert";
import { PasswordInput } from "./password-input";

const schema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name"),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

type FormValues = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      await mockSignUp(values.name, values.email);
      toast.success("Demo account created", { description: "You're exploring a workspace with sample data." });
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">Start with a demo workspace full of sample data.</p>
      </div>

      {error && <FormAlert tone="error">{error}</FormAlert>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Full name" htmlFor="su-name" error={errors.name?.message}>
          <Input autoComplete="name" {...fieldAria("su-name", errors.name?.message)} {...register("name")} />
        </FormField>
        <FormField label="Work email" htmlFor="su-email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...fieldAria("su-email", errors.email?.message)} {...register("email")} />
        </FormField>
        <FormField
          label="Password"
          htmlFor="su-password"
          error={errors.password?.message}
          description="At least 8 characters, including a letter and a number."
        >
          <PasswordInput autoComplete="new-password" {...fieldAria("su-password", errors.password?.message)} {...register("password")} />
        </FormField>
        <FormField label="Confirm password" htmlFor="su-confirm" error={errors.confirmPassword?.message}>
          <PasswordInput autoComplete="new-password" {...fieldAria("su-confirm", errors.confirmPassword?.message)} {...register("confirmPassword")} />
        </FormField>
        <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          This is a demo — your password isn&apos;t stored or sent anywhere.
        </p>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
