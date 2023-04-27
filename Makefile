.PHONY: dev

db:
	docker compose up -d
dev: db
	cargo run

watch:
	cargo watch -q -c -w src/ -x "run"

.PHONY: db-cli
db-cli:
	cargo install sea-orm-cli