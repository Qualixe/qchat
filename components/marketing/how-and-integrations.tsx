import { IntegrationLogo } from "@/components/shared/brand-icons";
import { integrations } from "@/lib/mock-data/integrations";

const STEPS = [
  {
    title: "Connect your channels",
    description: "Link your Facebook Page, Instagram, WhatsApp Business, and online store in a few clicks.",
  },
  {
    title: "Teach your assistant",
    description: "Add your policies, FAQs, and brand voice. Your synced catalog fills in product knowledge.",
  },
  {
    title: "Reply and grow",
    description: "Let AI handle routine questions while your team focuses on sales, complaints, and VIPs.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-violet-400">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Up and running in three steps</h2>
        </div>
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl border bg-card p-6">
              <span className="grid size-9 place-items-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
                {i + 1}
              </span>
              <h3 className="mt-5 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function IntegrationsSection() {
  return (
    <section id="integrations" className="scroll-mt-20 border-y bg-muted/20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-violet-400">Integrations</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Works where your customers already are</h2>
          <p className="mt-3 text-muted-foreground">Messaging channels and store platforms, connected to one workspace.</p>
        </div>
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {integrations.map((integration) => (
            <li key={integration.id} className="flex flex-col items-center gap-3 rounded-2xl border bg-background p-6 text-center">
              <IntegrationLogo id={integration.id} className="size-12 rounded-xl [&_svg]:size-6" />
              <p className="text-sm font-semibold">{integration.name}</p>
              <p className="text-xs text-muted-foreground">{integration.description}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Logos are simplified placeholders. Brand names belong to their respective owners.
        </p>
      </div>
    </section>
  );
}
