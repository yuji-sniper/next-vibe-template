export function GET() {
  const body = ["User-agent: *", "Disallow: /"].join("\n")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain"
    }
  })
}
