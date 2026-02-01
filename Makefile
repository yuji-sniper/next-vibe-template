dev:
	pnpm dev --port 3000

dev-admin:
	pnpm dev --port 3001

up:
	docker compose up -d

build:
	docker compose up -d --build

down:
	docker compose down

prune:
	docker system prune -a --volumes --force

tunnel:
	cloudflared tunnel --url http://localhost:3000

stripe-listen:
	stripe listen --forward-to localhost:3000/api/stripe/webhook
