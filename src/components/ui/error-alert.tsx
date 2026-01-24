import { Alert, AlertDescription } from "@/components/ui/alert"

type ErrorAlertProps = {
  messages: string[]
}

export function ErrorAlert({ messages }: ErrorAlertProps) {
  if (messages.length === 0) return null

  return (
    <Alert
      variant="destructive"
      className="bg-destructive/15 border-destructive/50"
    >
      <AlertDescription className="whitespace-pre-line">
        {messages.join("\n")}
      </AlertDescription>
    </Alert>
  )
}
