import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
