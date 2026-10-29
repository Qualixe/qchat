import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PLANS } from "@/lib/mock-data/settings";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-violet-400">Pricing</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Simple plans that grow with you</h2>
          <p className="mt-3 text-sm text-muted-foreground">Placeholder pricing for this prototype — final prices may differ.</p>
        </div>
        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const featured = plan.id === "growth";
            return (
              <li
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-card p-6",
                  featured && "border-primary shadow-xl ring-1 shadow-primary/10 ring-primary",
                )}
              >
                {featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                <p className="mt-6">
                  <span className="text-4xl font-semibold tracking-tight tabular-nums">{formatCurrency(plan.price)}</span>
                  <span className="text-sm text-muted-foreground"> / month</span>
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" /> {feature}
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 h-10" variant={featured ? "default" : "outline"} asChild>
                  <Link href="/signup">Start with {plan.name}</Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "Which channels does QChat support?",
    a: "Facebook Messenger, Instagram direct messages, WhatsApp Business, and a web chat widget, plus Shopify and WooCommerce for product and order data.",
  },
  {
    q: "Can the AI reply in Bangla and Banglish?",
    a: "Yes. You can fix a response language or let the assistant match each customer's language — Bengali script, English, or Banglish.",
  },
  {
    q: "Will the AI ever reply without my team knowing?",
    a: "You decide. Turn the assistant on or off per workspace and channel, and set rules for when it hands conversations to a teammate, such as complaints or refund requests.",
  },
  {
    q: "Is this demo connected to real accounts?",
    a: "No. This prototype runs entirely in your browser with sample data. Sign-in, integrations, AI replies, and billing are simulated, and nothing is sent to real customers.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "Not for the demo. Billing details for a production version haven't been finalized yet.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 border-t bg-muted/20 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-medium text-violet-400">FAQ</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Questions, answered</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 rounded-2xl border bg-background px-5">
          {FAQS.map((faq, i) => (
            <AccordionItem key={faq.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-[15px]">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,#5b21b6_0%,#7c3aed_45%,#9333ea_100%)] px-6 py-16 text-center text-white shadow-[0_0_100px_-30px_rgba(124,58,237,0.7)] sm:px-12">
          <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-10 [--border:white]" />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Ready to answer every customer, instantly?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Set up your workspace in minutes, or explore the full product with sample data first.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" className="h-11 px-5" asChild>
              <Link href="/signup">
                Get started <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 border-primary-foreground/30 bg-transparent px-5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <Link href="/dashboard">View live demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
