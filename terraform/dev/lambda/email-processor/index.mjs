import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { simpleParser } from "mailparser"
import postgres from "postgres"
import { v7 as uuidv7 } from "uuid"

const s3 = new S3Client()

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  max: 1
})

export async function handler(event) {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "))

    console.log(`Processing email: bucket=${bucket}, key=${key}`)

    let parsed = null
    try {
      const { Body } = await s3.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
      )
      const rawEmail = await Body.transformToString()
      parsed = await simpleParser(rawEmail)
    } catch (err) {
      console.error(
        `Failed to fetch/parse email: bucket=${bucket}, key=${key}`,
        err
      )
    }

    const id = uuidv7()
    const row = {
      id,
      message_id: parsed?.messageId ?? null,
      from_address: parsed?.from?.value?.[0]?.address ?? "unknown",
      from_name: parsed?.from?.value?.[0]?.name ?? null,
      to_addresses: JSON.stringify(
        parsed?.to?.value?.map((v) => ({ address: v.address, name: v.name })) ??
          []
      ),
      cc_addresses: parsed?.cc?.value
        ? JSON.stringify(
            parsed.cc.value.map((v) => ({ address: v.address, name: v.name }))
          )
        : null,
      subject: parsed?.subject ?? null,
      body_text: parsed?.text ?? null,
      body_html: parsed?.html || null,
      s3_bucket: bucket,
      s3_key: key,
      received_at: parsed?.date ?? null
    }

    try {
      await sql`
        INSERT INTO emails (
          id, message_id, from_address, from_name,
          to_addresses, cc_addresses, subject,
          body_text, body_html, s3_bucket, s3_key, received_at
        ) VALUES (
          ${row.id}, ${row.message_id}, ${row.from_address}, ${row.from_name},
          ${row.to_addresses}::jsonb, ${row.cc_addresses}::jsonb, ${row.subject},
          ${row.body_text}, ${row.body_html}, ${row.s3_bucket}, ${row.s3_key}, ${row.received_at}
        )
      `
      console.log(`Email saved: id=${id}, subject=${row.subject}`)
    } catch (err) {
      console.error(`Failed to save email to DB: id=${id}`, err)
      throw err
    }
  }
}
