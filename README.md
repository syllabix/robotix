# Robotix

A virtual robotic system visualization built with Next.js and Rust.

## Project Structure

```
.
├── client/          # Next.js frontend application
├── server/          # Rust backend server
└── Makefile        # Project automation scripts
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Rust (latest stable version)
- Cargo (Rust's package manager)

## Getting Started

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The client will be available at `http://localhost:3000`

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Build and run the server:
   ```bash
   cargo run
   ```

## Development

### Using `Make`

The project includes a Makefile to simplify common development tasks. Run `make help` to see all available commands