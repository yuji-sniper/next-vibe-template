"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  type ProductFormValues,
  productFormSchema
} from "@/features/admin-products/types/product-form"

type ProductFormProps = {
  mode?: "create" | "edit"
  defaultValues?: Partial<ProductFormValues>
  onSubmit: (values: ProductFormValues) => void
  isPending: boolean
  submitLabel?: string
}

type FeatureItem = {
  id: string
  value: string
}

export const ProductForm = ({
  mode = "create",
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "作成"
}: ProductFormProps) => {
  const [features, setFeatures] = useState<FeatureItem[]>(() =>
    (defaultValues?.features ?? []).map((value, index) => ({
      id: `feature-${index}`,
      value
    }))
  )

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      displayOrder: defaultValues?.displayOrder ?? 0,
      active: defaultValues?.active ?? true
    }
  })

  const handleAddFeature = () => {
    setFeatures((prev) => [...prev, { id: `feature-${Date.now()}`, value: "" }])
  }

  const handleRemoveFeature = (id: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id))
  }

  const handleFeatureChange = (id: string, value: string) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)))
  }

  const handleFormSubmit = (data: {
    name: string
    description?: string
    displayOrder?: number
    active?: boolean
  }) => {
    const featureValues = features
      .map((f) => f.value.trim())
      .filter((v) => v !== "")

    onSubmit({
      name: data.name,
      description: data.description,
      features: featureValues.length > 0 ? featureValues : undefined,
      displayOrder: data.displayOrder,
      active: mode === "edit" ? data.active : undefined
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                商品名 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="商品名を入力" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>説明</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="商品の説明を入力"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>最大5000文字まで入力できます</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>機能リスト</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddFeature}
            >
              <PlusIcon className="size-4" />
              追加
            </Button>
          </div>
          <FormDescription>商品の機能・特徴を追加できます</FormDescription>
          {features.length > 0 && (
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={feature.id} className="flex items-center gap-2">
                  <Input
                    placeholder={`機能 ${index + 1}`}
                    value={feature.value}
                    onChange={(e) =>
                      handleFeatureChange(feature.id, e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFeature(feature.id)}
                  >
                    <Trash2Icon className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>表示順</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  className="w-32"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === "" ? undefined : Number(value))
                  }}
                />
              </FormControl>
              <FormDescription>
                数値が小さいほど上位に表示されます
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {mode === "edit" && (
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">アクティブ</FormLabel>
                  <FormDescription>
                    無効にすると商品は非表示になります
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "処理中..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
