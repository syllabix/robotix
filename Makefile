.PHONY: help client.run server.run server.dev all

# Default target
.DEFAULT_GOAL := help

# Colors for help output
BLUE := \033[34m
GREEN := \033[32m
RESET := \033[0m

help: ## display this help message
	@echo "$(BLUE)Available targets:$(RESET)"
	@grep -E '^[a-zA-Z0-9_.-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'

setup: ## setup client and server project - required prior to being able to run and build the project
	@echo "$(BLUE)Setting up client dependencies...$(RESET)"
	cd client && npm install
	@echo "$(BLUE)Setting up server environment...$(RESET)"
	cd server && cp .env.example .env || (echo "$(BLUE)No .env.example found, skipping .env creation$(RESET)" && true)
	@echo "$(BLUE)Setting up Rust project...$(RESET)"
	cd server && cargo build
	@echo "$(BLUE)Installing cargo-watch...$(RESET)"
	cargo install cargo-watch

client.run: ## run the client in development mode
	cd client && npm run dev

server.run: ## run the server in development mode with auto-reload on file changes
	cd server && cargo watch -x 'run -- start'

all: setup ## setup and run both client and server in parallel
	@echo "$(BLUE)Starting both client and server...$(RESET)"
	@make -j 2 client.run server.run