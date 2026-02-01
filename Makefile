dev:
	pnpm dev --port 3000

dev-admin:
	pnpm dev --port 3001

up:
	docker compose up -d

tunnel:
	cloudflared tunnel --url http://localhost:3000
