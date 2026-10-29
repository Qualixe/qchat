import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaceholderPageProps {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}

/** Clearly-labelled placeholder for content that requires real business information. */
export function PlaceholderPage({ title, intro, sections }: PlaceholderPageProps) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <p className="mb-4 inline-flex rounded-full border border-amber-300/60 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
        Placeholder content
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 text-muted-foreground">{intro}</p>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-semibold">{section.heading}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
      <Button variant="outline" className="mt-12" asChild>
        <Link href="/">
          <ArrowLeft /> Back to home
        </Link>
      </Button>
    </article>
  );
}
