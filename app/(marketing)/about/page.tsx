import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About QChat"
      intro="QChat helps e-commerce teams manage customer conversations and automate routine support with AI. This page is a placeholder until company details are finalized."
      sections={[
        { heading: "Our mission", body: "[Placeholder] Describe the company's mission and the problem it solves for social commerce sellers." },
        { heading: "Team", body: "[Placeholder] Add information about the founding team and where the company is based." },
        { heading: "Contact", body: "[Placeholder] Add a real support email, address, and business registration details." },
      ]}
    />
  );
}
