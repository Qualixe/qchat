import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/placeholder-page";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <PlaceholderPage
      title="Privacy policy"
      intro="This is not a legal document. A real privacy policy must be written and reviewed before launch."
      sections={[
        { heading: "What this prototype stores", body: "The demo stores preferences (theme, settings, a display-only demo session) in your browser's local storage. Nothing is sent to a server." },
        { heading: "Data collection", body: "[Placeholder] Describe what personal data the production service collects and why." },
        { heading: "Your rights", body: "[Placeholder] Explain how users can access, export, or delete their data." },
      ]}
    />
  );
}
