"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import type { InvoiceHistoryItem } from "@/features/billing/types/invoice-history"
import type { Subscription } from "@/features/pricing/types/subscription"

const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf"
])

function formatPaymentAmount(
  amount: number,
  currency: string,
  locale: string
): string {
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency.toLowerCase())
  const displayAmount = isZeroDecimal ? amount : amount / 100

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(displayAmount)
}

function getStatusBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "paid":
      return "default"
    case "open":
      return "outline"
    case "void":
      return "secondary"
    case "uncollectible":
      return "destructive"
    default:
      return "secondary"
  }
}

type BillingSettingsPresentationalProps = {
  subscription: Subscription | undefined
  currentPlanName: string | undefined
  pricingPath: string
  invoices: InvoiceHistoryItem[]
  isDialogOpen: boolean
  isCanceling: boolean
  onOpenDialog: () => void
  onCloseDialog: () => void
  onCancelSubscription: () => void
  isResumeDialogOpen: boolean
  isResuming: boolean
  onOpenResumeDialog: () => void
  onCloseResumeDialog: () => void
  onResumeSubscription: () => void
}

export function BillingSettingsPresentational({
  subscription,
  currentPlanName,
  pricingPath,
  invoices,
  isDialogOpen,
  isCanceling,
  onOpenDialog,
  onCloseDialog,
  onCancelSubscription,
  isResumeDialogOpen,
  isResuming,
  onOpenResumeDialog,
  onCloseResumeDialog,
  onResumeSubscription
}: BillingSettingsPresentationalProps) {
  const t = useTranslations("settings")
  const locale = useLocale()

  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing"
  const isCancelScheduled = subscription?.cancelAtPeriodEnd === true

  const formattedPeriodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(locale)
    : null

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("billing.currentPlan")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {currentPlanName ?? t("billing.noPlan")}
            </p>
            {isActive && formattedPeriodEnd && (
              <p className="text-sm text-muted-foreground">
                {isCancelScheduled
                  ? `${t("billing.cancelScheduled")}: ~${formattedPeriodEnd}`
                  : `${t("billing.nextRenewal")}: ${formattedPeriodEnd}`}
              </p>
            )}
          </div>
          <Button asChild variant="outline">
            <Link href={pricingPath}>{t("billing.adjustPlan")}</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Invoice History Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("billing.invoiceHistory.title")}</CardTitle>
          <CardDescription>
            {t("billing.invoiceHistory.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("billing.invoiceHistory.empty")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("billing.invoiceHistory.date")}</TableHead>
                  <TableHead>{t("billing.invoiceHistory.amount")}</TableHead>
                  <TableHead>{t("billing.invoiceHistory.paidAt")}</TableHead>
                  <TableHead>{t("billing.invoiceHistory.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {new Date(invoice.createdAt).toLocaleDateString(locale)}
                    </TableCell>
                    <TableCell>
                      {formatPaymentAmount(
                        invoice.amount,
                        invoice.currency,
                        locale
                      )}
                    </TableCell>
                    <TableCell>
                      {invoice.paidAt
                        ? new Date(invoice.paidAt).toLocaleDateString(locale)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {t(`billing.invoiceHistory.statuses.${invoice.status}`)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Cancel Subscription Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("billing.cancelPlan.title")}</CardTitle>
          <CardDescription>
            {t("billing.cancelPlan.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          {isCancelScheduled ? (
            <Button onClick={onOpenResumeDialog}>
              {t("billing.resumePlan.button")}
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={onOpenDialog}
              disabled={!isActive}
            >
              {t("billing.cancelPlan.button")}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={onCloseDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("billing.cancelPlan.dialog.title")}</DialogTitle>
            <DialogDescription>
              {t("billing.cancelPlan.dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isCanceling}>
                {t("billing.cancelPlan.dialog.cancel")}
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={onCancelSubscription}
              disabled={isCanceling}
            >
              {isCanceling
                ? t("billing.cancelPlan.dialog.canceling")
                : t("billing.cancelPlan.dialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resume Subscription Dialog */}
      <Dialog open={isResumeDialogOpen} onOpenChange={onCloseResumeDialog}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("billing.resumePlan.dialog.title")}</DialogTitle>
            <DialogDescription>
              {t("billing.resumePlan.dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isResuming}>
                {t("billing.resumePlan.dialog.cancel")}
              </Button>
            </DialogClose>
            <Button onClick={onResumeSubscription} disabled={isResuming}>
              {isResuming
                ? t("billing.resumePlan.dialog.resuming")
                : t("billing.resumePlan.dialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
