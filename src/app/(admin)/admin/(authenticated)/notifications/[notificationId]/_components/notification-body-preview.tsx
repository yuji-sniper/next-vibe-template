"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type NotificationBodyPreviewProps = {
  bodyText: string
  bodyHtml: string | null
}

export const NotificationBodyPreview = ({
  bodyText,
  bodyHtml
}: NotificationBodyPreviewProps) => {
  const hasHtml = bodyHtml && bodyHtml.trim().length > 0

  if (!hasHtml) {
    return (
      <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
        {bodyText}
      </pre>
    )
  }

  return (
    <Tabs defaultValue="text">
      <TabsList>
        <TabsTrigger value="text">テキスト</TabsTrigger>
        <TabsTrigger value="html">HTML</TabsTrigger>
      </TabsList>

      <TabsContent value="text" className="mt-4">
        <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
          {bodyText}
        </pre>
      </TabsContent>

      <TabsContent value="html" className="mt-4">
        <iframe
          srcDoc={bodyHtml}
          sandbox="allow-same-origin"
          className="h-96 w-full rounded-md border bg-white"
          title="HTMLプレビュー"
        />
      </TabsContent>
    </Tabs>
  )
}
