"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, fieldAria } from "@/components/shared/form-field";
import { PRODUCT_STATUS } from "@/components/shared/status-maps";
import { PRODUCT_CATEGORIES, PRODUCT_IMAGES } from "@/lib/mock-data/products";
import { addProduct, updateProduct } from "@/lib/store/app-store";
import type { Product, ProductCategory, ProductStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    name: z.string().trim().min(3, "Product name must be at least 3 characters").max(80, "Keep the name under 80 characters"),
    sku: z
      .string()
      .trim()
      .regex(/^[A-Z0-9-]{4,20}$/i, "Use 4–20 letters, numbers, or dashes"),
    category: z.enum(PRODUCT_CATEGORIES as [ProductCategory, ...ProductCategory[]]),
    price: z.number({ error: "Enter a price" }).positive("Price must be greater than 0").max(1_000_000, "That price looks too high"),
    compareAtPrice: z.number().positive("Must be greater than 0").optional(),
    inventory: z.number({ error: "Enter a quantity" }).int("Use a whole number").min(0, "Inventory can't be negative"),
    status: z.enum(["active", "draft", "archived"]),
    description: z.string().max(400, "Keep the description under 400 characters"),
    image: z.string().min(1, "Choose an image"),
  })
  .refine((v) => v.compareAtPrice === undefined || v.compareAtPrice > v.price, {
    path: ["compareAtPrice"],
    message: "Compare-at price should be higher than the price",
  });

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  sku: "",
  category: "Clothing",
  price: 0,
  compareAtPrice: undefined,
  inventory: 0,
  status: "active",
  description: "",
  image: PRODUCT_IMAGES[0],
};

/** Converts empty number inputs to undefined instead of NaN. */
const optionalNumber = { setValueAs: (v: string) => (v === "" ? undefined : Number(v)) };

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY });

  useEffect(() => {
    if (!open) return;
    reset(
      product
        ? {
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            inventory: product.inventory,
            status: product.status,
            description: product.description,
            image: product.image,
          }
        : EMPTY,
    );
  }, [open, product, reset]);

  function onSubmit(values: FormValues) {
    const input = { ...values, sku: values.sku.toUpperCase() };
    if (product) {
      updateProduct(product.id, input);
      toast.success("Product updated", { description: values.name });
    } else {
      addProduct(input);
      toast.success("Product added", { description: values.name });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            {product?.source === "shopify"
              ? "Changes stay in this demo — they are not pushed to Shopify."
              : "Products you add here are available to the AI assistant."}
          </DialogDescription>
        </DialogHeader>
        <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <FormField label="Product name" htmlFor="pr-name" error={errors.name?.message}>
            <Input {...fieldAria("pr-name", errors.name?.message)} {...register("name")} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="SKU" htmlFor="pr-sku" error={errors.sku?.message}>
              <Input {...fieldAria("pr-sku", errors.sku?.message)} {...register("sku")} className="uppercase" />
            </FormField>
            <FormField label="Category" htmlFor="pr-category">
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="pr-category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Price (৳)" htmlFor="pr-price" error={errors.price?.message}>
              <Input type="number" min={0} inputMode="decimal" {...fieldAria("pr-price", errors.price?.message)} {...register("price", { valueAsNumber: true })} />
            </FormField>
            <FormField label="Compare-at (৳)" htmlFor="pr-compare" error={errors.compareAtPrice?.message} optional>
              <Input type="number" min={0} inputMode="decimal" {...fieldAria("pr-compare", errors.compareAtPrice?.message)} {...register("compareAtPrice", optionalNumber)} />
            </FormField>
            <FormField label="Inventory" htmlFor="pr-inventory" error={errors.inventory?.message}>
              <Input type="number" min={0} inputMode="numeric" {...fieldAria("pr-inventory", errors.inventory?.message)} {...register("inventory", { valueAsNumber: true })} />
            </FormField>
          </div>
          <FormField label="Status" htmlFor="pr-status">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(v) => field.onChange(v as ProductStatus)}>
                  <SelectTrigger id="pr-status" className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PRODUCT_STATUS) as ProductStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {PRODUCT_STATUS[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
          <FormField label="Description" htmlFor="pr-desc" error={errors.description?.message} optional>
            <Textarea rows={3} {...fieldAria("pr-desc", errors.description?.message)} {...register("description")} />
          </FormField>
          <fieldset>
            <legend className="mb-2 text-[13px] font-medium">Image</legend>
            <p className="mb-2 text-xs text-muted-foreground">Choose a placeholder image (uploads aren&apos;t stored in this demo).</p>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Product image">
                  {PRODUCT_IMAGES.map((src) => (
                    <button
                      key={src}
                      type="button"
                      role="radio"
                      aria-checked={field.value === src}
                      aria-label={src.split("/").pop()?.replace(".svg", "")}
                      onClick={() => field.onChange(src)}
                      className={cn(
                        "overflow-hidden rounded-md border-2 transition-colors",
                        field.value === src ? "border-primary" : "border-transparent hover:border-border",
                      )}
                    >
                      <Image src={src} alt="" width={64} height={64} className="aspect-square w-full" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            />
          </fieldset>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="product-form">
            {product ? "Save changes" : "Add product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
