"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Bot, Save, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PageContainer, PageIntro } from "@/components/shared/page-intro";
import { FormField, fieldAria } from "@/components/shared/form-field";
import { SwitchRow } from "@/components/shared/switch-row";
import { StatusBadge } from "@/components/shared/status-badge";
import { saveAiConfig, useAppStore } from "@/lib/store/app-store";
import { mockAiReply } from "@/lib/mock-ai";
import type { AiAssistantConfig, BrandVoice, Language, ResponseLength } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AiUsageCard } from "./ai-usage-card";
import { FaqEditor } from "./faq-editor";
import { TestChat } from "./test-chat";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "auto", label: "Detect automatically" },
  { value: "bn", label: "Bengali (বাংলা)" },
  { value: "en", label: "English" },
  { value: "banglish", label: "Banglish" },
];

const VOICES: { value: BrandVoice; label: string; description: string }[] = [
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
  { value: "professional", label: "Professional", description: "Polite and formal" },
  { value: "playful", label: "Playful", description: "Upbeat with emoji" },
  { value: "concise", label: "Concise", description: "Straight to the point" },
];

const LENGTHS: { value: ResponseLength; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "balanced", label: "Balanced" },
  { value: "detailed", label: "Detailed" },
];

const configSchema = z.object({
  name: z.string().trim().min(2, "Give your assistant a name (2+ characters)").max(40, "Keep the name under 40 characters"),
  instructions: z.string().max(1200, "Instructions can be up to 1,200 characters"),
  businessInfo: z.string().trim().min(10, "Add a short description of your business"),
  faqs: z.array(
    z.object({
      id: z.string(),
      question: z.string().trim().min(3, "Enter a question"),
      answer: z.string().trim().min(3, "Enter an answer"),
    }),
  ),
  handoff: z.object({ handoffMessage: z.string().trim().min(5, "Enter a handoff message") }),
});

type Errors = Record<string, string>;

function validate(config: AiAssistantConfig): Errors {
  const result = configSchema.safeParse(config);
  if (result.success) return {};
  const errors: Errors = {};
  for (const issue of result.error.issues) {
    const [first, index, field] = issue.path;
    const key = first === "faqs" && typeof index === "number" ? `${config.faqs[index]?.id}.${String(field)}` : issue.path.join(".");
    errors[key] ??= issue.message;
  }
  return errors;
}

export function AiAssistantView() {
  const saved = useAppStore((s) => s.aiConfig);
  const hydrated = useAppStore((s) => s.hydrated);
  // Re-mount once persisted settings are restored so the draft starts from them.
  return <AiAssistantEditor key={hydrated ? "restored" : "initial"} saved={saved} />;
}

function AiAssistantEditor({ saved }: { saved: AiAssistantConfig }) {
  const [draft, setDraft] = useState<AiAssistantConfig>(saved);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);
  const preview = useMemo(() => mockAiReply("Delivery charge koto? Kobe pabo?", draft), [draft]);

  function patch(update: Partial<AiAssistantConfig>) {
    setDraft((d) => ({ ...d, ...update }));
  }

  function handleSave() {
    const nextErrors = validate(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSaving(true);
    // Simulated network latency.
    setTimeout(() => {
      saveAiConfig(draft);
      setSaving(false);
      toast.success("AI assistant settings saved", { description: "Saved in this browser (demo)." });
    }, 600);
  }

  return (
    <PageContainer>
      <PageIntro
        description="Configure how your AI assistant replies to customers across every connected channel."
        actions={
          <>
            {dirty && <StatusBadge tone="warning">Unsaved changes</StatusBadge>}
            <Button variant="outline" onClick={() => { setDraft(saved); setErrors({}); }} disabled={!dirty || saving}>
              <Undo2 /> Discard
            </Button>
            <Button onClick={handleSave} disabled={!dirty || saving}>
              <Save /> {saving ? "Saving…" : "Save changes"}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Assistant</CardTitle>
              <CardDescription className="text-xs">Name, status, and how it speaks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                <span className={cn("grid size-10 place-items-center rounded-lg", draft.enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                  <Bot className="size-5" aria-hidden="true" />
                </span>
                <SwitchRow
                  className="flex-1 py-0"
                  label={draft.enabled ? "Assistant is on" : "Assistant is off"}
                  description={draft.enabled ? "Replies automatically to new customer messages." : "All messages go straight to your team."}
                  checked={draft.enabled}
                  onCheckedChange={(enabled) => patch({ enabled })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Assistant name" htmlFor="ai-name" error={errors.name}>
                  <Input {...fieldAria("ai-name", errors.name)} value={draft.name} onChange={(e) => patch({ name: e.target.value })} />
                </FormField>
                <FormField label="Response language" htmlFor="ai-language">
                  <Select value={draft.language} onValueChange={(v) => patch({ language: v as Language })}>
                    <SelectTrigger id="ai-language" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <fieldset>
                <legend className="mb-2 text-[13px] font-medium">Brand voice</legend>
                <RadioGroup
                  value={draft.voice}
                  onValueChange={(v) => patch({ voice: v as BrandVoice })}
                  className="grid grid-cols-2 gap-2 lg:grid-cols-4"
                >
                  {VOICES.map((voice) => (
                    <Label
                      key={voice.value}
                      htmlFor={`voice-${voice.value}`}
                      className={cn(
                        "flex cursor-pointer flex-col items-start gap-1 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                        draft.voice === voice.value && "border-primary/40 bg-accent/60",
                      )}
                    >
                      <span className="flex w-full items-center justify-between">
                        <span className="text-[13px] font-medium">{voice.label}</span>
                        <RadioGroupItem id={`voice-${voice.value}`} value={voice.value} />
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">{voice.description}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-[13px] font-medium">Response length</legend>
                <div className="inline-flex rounded-lg border p-0.5" role="radiogroup" aria-label="Response length">
                  {LENGTHS.map((length) => (
                    <button
                      key={length.value}
                      type="button"
                      role="radio"
                      aria-checked={draft.responseLength === length.value}
                      onClick={() => patch({ responseLength: length.value })}
                      className={cn(
                        "h-7 rounded-md px-3 text-xs font-medium transition-colors",
                        draft.responseLength === length.value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {length.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Knowledge</CardTitle>
              <CardDescription className="text-xs">What the assistant knows about your business.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Custom instructions"
                htmlFor="ai-instructions"
                error={errors.instructions}
                description={`${draft.instructions.length}/1200 · Rules the assistant must always follow.`}
              >
                <Textarea
                  {...fieldAria("ai-instructions", errors.instructions)}
                  rows={4}
                  value={draft.instructions}
                  onChange={(e) => patch({ instructions: e.target.value })}
                />
              </FormField>
              <FormField label="Business information" htmlFor="ai-business" error={errors.businessInfo}>
                <Textarea
                  {...fieldAria("ai-business", errors.businessInfo)}
                  rows={3}
                  value={draft.businessInfo}
                  onChange={(e) => patch({ businessInfo: e.target.value })}
                />
              </FormField>
              <Separator />
              <div>
                <p className="mb-2 text-[13px] font-medium">Frequently asked questions</p>
                <FaqEditor faqs={draft.faqs} onChange={(faqs) => patch({ faqs })} errors={errors} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="gap-1">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Product knowledge</CardTitle>
                <CardDescription className="text-xs">Uses your synced catalog (sample data).</CardDescription>
              </CardHeader>
              <CardContent className="divide-y">
                <SwitchRow
                  label="Answer from product catalog"
                  checked={draft.productKnowledge.useCatalog}
                  onCheckedChange={(v) => patch({ productKnowledge: { ...draft.productKnowledge, useCatalog: v } })}
                />
                <SwitchRow
                  label="Share prices"
                  checked={draft.productKnowledge.sharePrices}
                  disabled={!draft.productKnowledge.useCatalog}
                  onCheckedChange={(v) => patch({ productKnowledge: { ...draft.productKnowledge, sharePrices: v } })}
                />
                <SwitchRow
                  label="Share stock levels"
                  checked={draft.productKnowledge.shareStockLevels}
                  disabled={!draft.productKnowledge.useCatalog}
                  onCheckedChange={(v) => patch({ productKnowledge: { ...draft.productKnowledge, shareStockLevels: v } })}
                />
                <SwitchRow
                  label="Recommend similar products"
                  checked={draft.productKnowledge.recommendSimilar}
                  disabled={!draft.productKnowledge.useCatalog}
                  onCheckedChange={(v) => patch({ productKnowledge: { ...draft.productKnowledge, recommendSimilar: v } })}
                />
              </CardContent>
            </Card>

            <Card className="gap-1">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Human handoff</CardTitle>
                <CardDescription className="text-xs">When to pass a conversation to your team.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  <SwitchRow
                    label="Complaints"
                    checked={draft.handoff.onComplaint}
                    onCheckedChange={(v) => patch({ handoff: { ...draft.handoff, onComplaint: v } })}
                  />
                  <SwitchRow
                    label="Refund requests"
                    checked={draft.handoff.onRefundRequest}
                    onCheckedChange={(v) => patch({ handoff: { ...draft.handoff, onRefundRequest: v } })}
                  />
                  <SwitchRow
                    label="Low-confidence answers"
                    checked={draft.handoff.onLowConfidence}
                    onCheckedChange={(v) => patch({ handoff: { ...draft.handoff, onLowConfidence: v } })}
                  />
                </div>
                {draft.handoff.onLowConfidence && (
                  <div className="space-y-2 pt-2 pb-3">
                    <div className="flex items-center justify-between text-xs">
                      <Label htmlFor="ai-threshold" className="text-xs">Confidence threshold</Label>
                      <span className="font-medium tabular-nums">{draft.handoff.confidenceThreshold}%</span>
                    </div>
                    <Slider
                      id="ai-threshold"
                      min={40}
                      max={95}
                      step={5}
                      value={[draft.handoff.confidenceThreshold]}
                      onValueChange={([v]) => patch({ handoff: { ...draft.handoff, confidenceThreshold: v ?? 70 } })}
                      aria-label="Confidence threshold"
                    />
                  </div>
                )}
                <FormField label="Handoff message" htmlFor="ai-handoff" error={errors["handoff.handoffMessage"]} className="pt-1">
                  <Textarea
                    {...fieldAria("ai-handoff", errors["handoff.handoffMessage"])}
                    rows={2}
                    value={draft.handoff.handoffMessage}
                    onChange={(e) => patch({ handoff: { ...draft.handoff, handoffMessage: e.target.value } })}
                  />
                </FormField>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Response preview</CardTitle>
              <CardDescription className="text-xs">Updates live as you change settings (unsaved changes included).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-[13px] text-primary-foreground">
                  Delivery charge koto? Kobe pabo?
                </p>
              </div>
              <div className="flex">
                <p className={cn("max-w-[85%] rounded-2xl rounded-bl-md border px-3 py-2 text-[13px] leading-relaxed", draft.enabled ? "border-primary/15 bg-accent/50" : "bg-muted text-muted-foreground")}>
                  <span className="mb-0.5 block text-[10px] font-medium text-primary">{draft.name || "Assistant"}</span>
                  {draft.enabled ? preview.text : "Assistant is off — a teammate would reply."}
                </p>
              </div>
            </CardContent>
          </Card>
          <TestChat config={draft} />
          <AiUsageCard compact />
        </div>
      </div>
    </PageContainer>
  );
}
