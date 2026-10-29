"use client";

import { useRef, useState } from "react";
import { Lock, MessageSquare, Paperclip, SendHorizontal, Smile, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { MessageAttachment } from "@/lib/types";
import { cn } from "@/lib/utils";

const EMOJIS = ["😊", "🙏", "👍", "❤️", "🎉", "✅", "📦", "🚚", "🛍️", "💄", "✨", "😅", "🙌", "👋", "🎁", "⏰"];

export type ComposerMode = "reply" | "note";

interface MessageComposerProps {
  draft: string;
  onDraftChange: (value: string) => void;
  mode: ComposerMode;
  onModeChange: (mode: ComposerMode) => void;
  onSend: (body: string, attachment?: MessageAttachment) => void;
  onSuggest: () => void;
  aiEnabled: boolean;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MessageComposer({
  draft,
  onDraftChange,
  mode,
  onModeChange,
  onSend,
  onSuggest,
  aiEnabled,
}: MessageComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<MessageAttachment | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const isNote = mode === "note";
  const canSend = draft.trim().length > 0 || attachment !== null;

  function submit() {
    if (!canSend) return;
    onSend(draft.trim(), attachment ?? undefined);
    setAttachment(null);
    textareaRef.current?.focus();
  }

  function insertAtCursor(text: string) {
    const el = textareaRef.current;
    if (!el) {
      onDraftChange(draft + text);
      return;
    }
    const start = el.selectionStart ?? draft.length;
    const end = el.selectionEnd ?? draft.length;
    onDraftChange(draft.slice(0, start) + text + draft.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  }

  return (
    <div className="border-t bg-background p-3">
      <div
        className={cn(
          "rounded-xl border bg-background shadow-xs transition-colors focus-within:ring-3",
          isNote ? "border-amber-300 bg-amber-50/60 focus-within:ring-amber-400/25 dark:border-amber-400/30 dark:bg-amber-500/5" : "focus-within:border-ring focus-within:ring-ring/25",
        )}
      >
        <div className="flex items-center gap-1 border-b px-2 pt-1.5 pb-1" role="group" aria-label="Composer mode">
          <ModeButton active={!isNote} onClick={() => onModeChange("reply")} icon={MessageSquare} label="Reply" />
          <ModeButton active={isNote} onClick={() => onModeChange("note")} icon={Lock} label="Internal note" />
          {isNote && <span className="ml-auto text-[11px] text-amber-700 dark:text-amber-300">Only your team will see this</span>}
        </div>

        <label htmlFor="composer" className="sr-only">
          {isNote ? "Write an internal note" : "Write a reply"}
        </label>
        <textarea
          id="composer"
          ref={textareaRef}
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          placeholder={isNote ? "Add a note for your teammates…" : "Type your reply… (Enter to send, Shift+Enter for a new line)"}
          className="block max-h-40 min-h-[56px] w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
        />

        {attachment && (
          <div className="mx-3 mb-2 flex items-center gap-2 rounded-md border bg-muted/50 px-2 py-1.5 text-xs">
            <Paperclip className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate font-medium">{attachment.name}</span>
            <span className="text-muted-foreground">{attachment.size}</span>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="grid size-5 place-items-center rounded hover:bg-muted"
              aria-label="Remove attachment"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-1 px-2 pb-2">
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Only file metadata is kept — nothing is uploaded in this demo.
                setAttachment({
                  name: file.name,
                  size: formatSize(file.size),
                  kind: file.type.startsWith("image/") ? "image" : "file",
                });
              }
              e.target.value = "";
            }}
          />
          <IconAction label="Attach file" onClick={() => fileRef.current?.click()}>
            <Paperclip />
          </IconAction>

          <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Insert emoji">
                    <Smile />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Emoji</TooltipContent>
            </Tooltip>
            <PopoverContent align="start" className="w-64 p-2">
              <div className="grid grid-cols-8 gap-0.5">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="grid size-7 place-items-center rounded text-base hover:bg-muted"
                    onClick={() => {
                      insertAtCursor(emoji);
                      setEmojiOpen(false);
                    }}
                    aria-label={`Insert ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {!isNote && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary"
              onClick={onSuggest}
              disabled={!aiEnabled}
              title={aiEnabled ? undefined : "Enable the AI assistant to use suggestions"}
            >
              <Sparkles /> AI suggestion
            </Button>
          )}

          <Button
            size="sm"
            className={cn("ml-auto", isNote && "bg-amber-500 text-white hover:bg-amber-500/85")}
            onClick={submit}
            disabled={!canSend}
          >
            {isNote ? "Add note" : "Send"}
            <SendHorizontal data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Lock;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors",
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}

function IconAction({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" onClick={onClick} aria-label={label}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
