"use client";

import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowDown, Plus, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, fieldAria } from "@/components/shared/form-field";
import { SwitchRow } from "@/components/shared/switch-row";
import {
  ACTION_LABELS,
  CONDITION_FIELD_LABELS,
  CONDITION_OPERATOR_LABELS,
  TRIGGER_LABELS,
} from "@/lib/mock-data/automations";
import { TOPIC_LABELS } from "@/lib/mock-data/analytics";
import { saveAutomation, useAppStore } from "@/lib/store/app-store";
import { createId } from "@/lib/format";
import type { Automation, AutomationActionType, AutomationTrigger, ConditionField, ConditionOperator } from "@/lib/types";

const TRIGGERS = Object.keys(TRIGGER_LABELS) as AutomationTrigger[];
const ACTIONS = Object.keys(ACTION_LABELS) as AutomationActionType[];
const FIELDS = Object.keys(CONDITION_FIELD_LABELS) as ConditionField[];
const OPERATORS = Object.keys(CONDITION_OPERATOR_LABELS) as ConditionOperator[];

const MESSAGE_ACTIONS: AutomationActionType[] = ["send_message", "recommend_products"];
const TEAM_ACTIONS: AutomationActionType[] = ["assign_teammate", "notify_teammate"];

const schema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters").max(60, "Keep the name under 60 characters"),
    description: z.string().max(140, "Keep the description under 140 characters"),
    trigger: z.enum(TRIGGERS as [AutomationTrigger, ...AutomationTrigger[]]),
    triggerValue: z.string(),
    conditions: z.array(
      z.object({
        id: z.string(),
        field: z.enum(FIELDS as [ConditionField, ...ConditionField[]]),
        operator: z.enum(OPERATORS as [ConditionOperator, ...ConditionOperator[]]),
        value: z.string().trim().min(1, "Enter a value"),
      }),
    ),
    action: z.enum(ACTIONS as [AutomationActionType, ...AutomationActionType[]]),
    actionTarget: z.string(),
    responseTemplate: z.string().max(500, "Templates can be up to 500 characters"),
    active: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if ((values.trigger === "keyword_match" || values.trigger === "topic_detected" || values.trigger === "no_reply_timeout") && !values.triggerValue.trim()) {
      ctx.addIssue({ code: "custom", path: ["triggerValue"], message: "This trigger needs a value" });
    }
    if (values.trigger === "no_reply_timeout" && values.triggerValue && !/^\d+$/.test(values.triggerValue.trim())) {
      ctx.addIssue({ code: "custom", path: ["triggerValue"], message: "Enter a number of minutes" });
    }
    if (values.action === "send_message" && !values.responseTemplate.trim()) {
      ctx.addIssue({ code: "custom", path: ["responseTemplate"], message: "Write the message to send" });
    }
    if ((TEAM_ACTIONS.includes(values.action) || values.action === "add_tag") && !values.actionTarget) {
      ctx.addIssue({ code: "custom", path: ["actionTarget"], message: "Choose a target" });
    }
  });

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  description: "",
  trigger: "new_conversation",
  triggerValue: "",
  conditions: [],
  action: "send_message",
  actionTarget: "",
  responseTemplate: "",
  active: true,
};

function toFormValues(a: Automation): FormValues {
  return {
    name: a.name,
    description: a.description,
    trigger: a.trigger,
    triggerValue: a.triggerValue ?? "",
    conditions: a.conditions,
    action: a.action,
    actionTarget: a.actionTarget ?? "",
    responseTemplate: a.responseTemplate ?? "",
    active: a.active,
  };
}

interface AutomationBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  automation?: Automation | null;
}

export function AutomationBuilderDialog({ open, onOpenChange, automation }: AutomationBuilderDialogProps) {
  const team = useAppStore((s) => s.team);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY });
  const { fields, append, remove } = useFieldArray({ control, name: "conditions" });
  const trigger = useWatch({ control, name: "trigger" });
  const action = useWatch({ control, name: "action" });

  useEffect(() => {
    if (open) reset(automation ? toFormValues(automation) : EMPTY);
  }, [open, automation, reset]);

  function onSubmit(values: FormValues) {
    saveAutomation(
      {
        ...values,
        triggerValue: values.triggerValue.trim() || undefined,
        actionTarget: values.actionTarget || undefined,
        responseTemplate: values.responseTemplate.trim() || undefined,
      },
      automation?.id,
    );
    toast.success(automation ? "Automation updated" : "Automation created", {
      description: `${values.name} is ${values.active ? "active" : "inactive"} (simulation).`,
    });
    onOpenChange(false);
  }

  const needsTriggerValue = trigger === "keyword_match" || trigger === "topic_detected" || trigger === "no_reply_timeout";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{automation ? "Edit automation" : "Create automation"}</DialogTitle>
          <DialogDescription>
            Automations are simulated in this demo — they won&apos;t send messages to real customers.
          </DialogDescription>
        </DialogHeader>

        <form id="automation-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Automation name" htmlFor="au-name" error={errors.name?.message}>
              <Input {...fieldAria("au-name", errors.name?.message)} {...register("name")} placeholder="e.g. Welcome new customers" />
            </FormField>
            <FormField label="Description" htmlFor="au-desc" error={errors.description?.message} optional>
              <Input {...fieldAria("au-desc", errors.description?.message)} {...register("description")} />
            </FormField>
          </div>

          <Step number={1} title="When this happens">
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Trigger" htmlFor="au-trigger">
                <Controller
                  control={control}
                  name="trigger"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        setValue("triggerValue", "");
                      }}
                    >
                      <SelectTrigger id="au-trigger" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TRIGGERS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {TRIGGER_LABELS[t]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              {needsTriggerValue && (
                <FormField
                  label={trigger === "keyword_match" ? "Keywords" : trigger === "topic_detected" ? "Topic" : "Minutes without reply"}
                  htmlFor="au-trigger-value"
                  error={errors.triggerValue?.message}
                  description={trigger === "keyword_match" ? "Separate keywords with commas" : undefined}
                >
                  {trigger === "topic_detected" ? (
                    <Controller
                      control={control}
                      name="triggerValue"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="au-trigger-value" className="w-full" aria-invalid={errors.triggerValue ? true : undefined}>
                            <SelectValue placeholder="Choose a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(TOPIC_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  ) : (
                    <Input
                      {...fieldAria("au-trigger-value", errors.triggerValue?.message)}
                      {...register("triggerValue")}
                      inputMode={trigger === "no_reply_timeout" ? "numeric" : undefined}
                    />
                  )}
                </FormField>
              )}
            </div>
          </Step>

          <Step number={2} title="Only if (optional conditions)">
            <div className="space-y-2">
              {fields.length === 0 && <p className="text-xs text-muted-foreground">Runs on every matching trigger.</p>}
              {fields.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[1fr_1fr] gap-2 sm:grid-cols-[1fr_120px_1fr_auto]">
                  <Controller
                    control={control}
                    name={`conditions.${index}.field`}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full" aria-label={`Condition ${index + 1} field`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FIELDS.map((f) => (
                            <SelectItem key={f} value={f}>
                              {CONDITION_FIELD_LABELS[f]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Controller
                    control={control}
                    name={`conditions.${index}.operator`}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full" aria-label={`Condition ${index + 1} operator`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map((o) => (
                            <SelectItem key={o} value={o}>
                              {CONDITION_OPERATOR_LABELS[o]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <div className="space-y-1">
                    <Input
                      {...register(`conditions.${index}.value`)}
                      placeholder="Value"
                      aria-label={`Condition ${index + 1} value`}
                      aria-invalid={errors.conditions?.[index]?.value ? true : undefined}
                    />
                    {errors.conditions?.[index]?.value && (
                      <p className="text-xs text-destructive">{errors.conditions[index]?.value?.message}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(index)} aria-label={`Remove condition ${index + 1}`}>
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => append({ id: createId("cond"), field: "channel", operator: "is", value: "" })}
              >
                <Plus /> Add condition
              </Button>
            </div>
          </Step>

          <Step number={3} title="Do this" last>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Action" htmlFor="au-action">
                <Controller
                  control={control}
                  name="action"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v);
                        setValue("actionTarget", "");
                      }}
                    >
                      <SelectTrigger id="au-action" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIONS.map((a) => (
                          <SelectItem key={a} value={a}>
                            {ACTION_LABELS[a]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              {(TEAM_ACTIONS.includes(action) || action === "add_tag") && (
                <FormField label={action === "add_tag" ? "Tag" : "Teammate"} htmlFor="au-target" error={errors.actionTarget?.message}>
                  {action === "add_tag" ? (
                    <Input {...fieldAria("au-target", errors.actionTarget?.message)} {...register("actionTarget")} placeholder="e.g. Wholesale" />
                  ) : (
                    <Controller
                      control={control}
                      name="actionTarget"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="au-target" className="w-full" aria-invalid={errors.actionTarget ? true : undefined}>
                            <SelectValue placeholder="Choose teammate" />
                          </SelectTrigger>
                          <SelectContent>
                            {team.filter((m) => !m.invited).map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                </FormField>
              )}
            </div>
            {(MESSAGE_ACTIONS.includes(action) || action === "ai_reply") && (
              <FormField
                className="mt-3"
                label="Response template"
                htmlFor="au-template"
                error={errors.responseTemplate?.message}
                optional={action !== "send_message"}
                description="Variables: {{first_name}}, {{related_products}}, {{order_number}}"
              >
                <Textarea {...fieldAria("au-template", errors.responseTemplate?.message)} rows={3} {...register("responseTemplate")} />
              </FormField>
            )}
          </Step>

          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <SwitchRow
                className="rounded-lg border px-3"
                label="Active"
                description="Inactive automations are saved but never run."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="automation-form">
            <Zap /> {automation ? "Save automation" : "Create automation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Step({ number, title, last, children }: { number: number; title: string; last?: boolean; children: React.ReactNode }) {
  return (
    <section className="relative rounded-xl border bg-muted/20 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-[13px] font-semibold">
        <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] text-primary-foreground">{number}</span>
        {title}
      </h3>
      {children}
      {!last && (
        <span className="absolute -bottom-3.5 left-1/2 z-10 grid size-6 -translate-x-1/2 place-items-center rounded-full border bg-background text-muted-foreground">
          <ArrowDown className="size-3" aria-hidden="true" />
        </span>
      )}
    </section>
  );
}
