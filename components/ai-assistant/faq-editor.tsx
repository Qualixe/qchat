"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createId } from "@/lib/format";
import type { FaqItem } from "@/lib/types";

interface FaqEditorProps {
  faqs: FaqItem[];
  onChange: (faqs: FaqItem[]) => void;
  errors?: Record<string, string>;
}

export function FaqEditor({ faqs, onChange, errors = {} }: FaqEditorProps) {
  function update(id: string, patch: Partial<FaqItem>) {
    onChange(faqs.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  return (
    <div className="space-y-3">
      {faqs.length === 0 && (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          No FAQs yet. Add common questions so the assistant answers them consistently.
        </p>
      )}
      {faqs.map((faq, index) => (
        <fieldset key={faq.id} className="space-y-2 rounded-lg border bg-muted/20 p-3">
          <legend className="sr-only">FAQ {index + 1}</legend>
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-1">
              <Input
                value={faq.question}
                onChange={(e) => update(faq.id, { question: e.target.value })}
                placeholder="Question"
                aria-label={`FAQ ${index + 1} question`}
                aria-invalid={errors[`${faq.id}.question`] ? true : undefined}
              />
              {errors[`${faq.id}.question`] && (
                <p className="text-xs text-destructive">{errors[`${faq.id}.question`]}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange(faqs.filter((f) => f.id !== faq.id))}
              aria-label={`Remove FAQ ${index + 1}`}
            >
              <Trash2 />
            </Button>
          </div>
          <Textarea
            value={faq.answer}
            onChange={(e) => update(faq.id, { answer: e.target.value })}
            placeholder="Answer"
            rows={2}
            aria-label={`FAQ ${index + 1} answer`}
            aria-invalid={errors[`${faq.id}.answer`] ? true : undefined}
          />
          {errors[`${faq.id}.answer`] && <p className="text-xs text-destructive">{errors[`${faq.id}.answer`]}</p>}
        </fieldset>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange([...faqs, { id: createId("faq"), question: "", answer: "" }])}
      >
        <Plus /> Add FAQ
      </Button>
    </div>
  );
}
