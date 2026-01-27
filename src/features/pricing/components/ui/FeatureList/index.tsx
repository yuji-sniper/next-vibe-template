"use client"

import { CheckIcon } from "lucide-react"

type Props = {
  features: string[]
}

export const FeatureList = ({ features }: Props) => {
  if (features.length === 0) {
    return null
  }

  return (
    <ul className="space-y-2">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2">
          <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
          <span className="text-sm text-muted-foreground">{feature}</span>
        </li>
      ))}
    </ul>
  )
}
