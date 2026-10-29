"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, RotateCcw, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockAiReply } from "@/lib/mock-ai";
import type { AiAssistantConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChatLine {
  id: number;
  from: "customer" | "ai" | "system";
  text: string;
}

const SAMPLE_PROMPTS = ["Delivery charge koto?", "Is the kurti available in M?", "আমার পণ্য ভাঙা এসেছে", "Can I exchange a size?"];

export function TestChat({ config }: { config: AiAssistantConfig }) {
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, thinking]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function push(from: ChatLine["from"], text: string) {
    const id = nextId.current++;
    setLines((l) => [...l, { id, from, text }]);
  }

  function ask(question: string) {
    const text = question.trim();
    if (!text || thinking) return;
    push("customer", text);
    setInput("");
    if (!config.enabled) {
      push("system", "The AI assistant is turned off — this message would go to your team's inbox.");
      return;
    }
    setThinking(true);
    timer.current = setTimeout(() => {
      const reply = mockAiReply(text, config);
      push("ai", reply.text);
      if (reply.handoff) push("system", "Handed off to a teammate (simulated)");
      setThinking(false);
    }, 900);
  }

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Test chat</CardTitle>
        <CardDescription className="text-xs">Try your settings with predefined demo responses — no AI API is called.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" onClick={() => setLines([])} aria-label="Clear test chat" disabled={!lines.length}>
            <RotateCcw />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          ref={scrollRef}
          className="scrollbar-thin h-72 space-y-2.5 overflow-y-auto rounded-lg border bg-muted/30 p-3"
          role="log"
          aria-live="polite"
          aria-label="Test conversation"
        >
          {lines.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground">
                <Bot className="size-4" aria-hidden="true" />
              </span>
              <p className="text-xs text-muted-foreground">Send a message as a customer, or try a sample:</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {SAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => ask(prompt)}
                    className="rounded-full border bg-background px-2.5 py-1 text-xs hover:bg-muted"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          {lines.map((line) =>
            line.from === "system" ? (
              <p key={line.id} className="text-center text-[11px] text-muted-foreground">
                {line.text}
              </p>
            ) : (
              <div key={line.id} className={cn("flex", line.from === "customer" ? "justify-end" : "justify-start")}>
                <p
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed",
                    line.from === "customer"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md border border-primary/15 bg-background",
                  )}
                >
                  {line.from === "ai" && <span className="mb-0.5 block text-[10px] font-medium text-primary">{config.name}</span>}
                  {line.text}
                </p>
              </div>
            ),
          )}
          {thinking && (
            <div className="flex gap-1 px-1" role="status" aria-label="Assistant is typing">
              {[0, 150, 300].map((d) => (
                <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          )}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask as a customer…"
            aria-label="Test message"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || thinking} aria-label="Send test message">
            <SendHorizontal />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
