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
import { MOCK_FAILURE_DOMAIN, mockSignIn } from "@/lib/auth/mock-auth";
import { FormAlert } from "./form-alert";
import { PasswordInput } from "./password-input";

const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      await mockSignIn(values.email);
      toast.success("Signed in to the demo workspace");
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Log in to your QChat workspace.</p>
      </div>

      <FormAlert tone="info">
        Demo mode: any email and password will sign you in. Use an address ending in <code>{MOCK_FAILURE_DOMAIN}</code> to
        see an error.
      </FormAlert>
      {error && <FormAlert tone="error">{error}</FormAlert>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Email" htmlFor="login-email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...fieldAria("login-email", errors.email?.message)} {...register("email")} />
        </FormField>
        <div className="grid gap-1.5">
          <FormField label="Password" htmlFor="login-password" error={errors.password?.message}>
            <PasswordInput autoComplete="current-password" {...fieldAria("login-password", errors.password?.message)} {...register("password")} />
          </FormField>
          <Link href="/forgot-password" className="justify-self-end text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Signing in…" : "Log in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New to QChat?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
