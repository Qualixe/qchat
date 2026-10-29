import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <PlaceholderPage
      title="Terms of service"
      intro="This is not a legal document. Real terms of service must be drafted and reviewed before launch."
      sections={[
        { heading: "Use of the service", body: "[Placeholder] Define acceptable use, account responsibilities, and service availability." },
        { heading: "Billing", body: "[Placeholder] Describe plans, billing cycles, refunds, and cancellations." },
        { heading: "Liability", body: "[Placeholder] Add limitation of liability and governing law." },
      ]}
    />
  );
}
