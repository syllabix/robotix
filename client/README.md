# robotix web client

A Next.js-based web client for the robotix project, featuring 3D visualization using Three.js and React Three Fiber.

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```
This will start the Next.js development server with Turbopack for faster builds.

## Building for Production

1. Create a production build:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

- `/app` - Next.js app directory containing pages and layouts
- `/components` - Reusable React components
- `/public` - Static assets
- `/state` - State management
- `/types` - TypeScript type definitions
- `/api` - API integration code

## Working with Three.js and React Three Fiber

### Scale and Units

The project uses a 1:1 scale where 1 unit equals 1 meter (Three.js default). This is important for accurate 3D modeling and physics calculations.

#### Unit Conversion Table
| Real World | Three.js Units |
| ---------- | -------------- |
| 1 mm       | 0.001          |
| 10 mm      | 0.01           |
| 100 mm     | 0.1            |
| 1000 mm    | 1              |

### Example Usage

```tsx
// Creating a box with specific dimensions
<mesh position={[0, 0, 0]}>
  <boxGeometry args={[0.1, 0.2, 0.05]} /> {/* 100mm × 200mm × 50mm */}
</mesh>

// Using a helper function for millimeter conversion
const mm = (value: number) => value / 1000;

<mesh position={[mm(100), mm(200), mm(50)]}>
  <boxGeometry args={[mm(100), mm(200), mm(50)]} />
</mesh>
```

## Environment Configuration

The project uses environment variables for configuration. To get started:

1. Create a `.env.local` file in the client directory:
```bash
cp .env.example .env.local
```

2. Configure your environment variables in `.env.local`. 

3. Available environment files:
- `.env.example` - Template file with example variables
- `.env.local` - Local development overrides (not committed to git)
- `.env.development` - Development environment defaults
- `.env.production` - Production environment defaults

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Dependencies

Key dependencies include:
- Next.js 15.3.1
- React 19
- Three.js 0.176.0
- React Three Fiber 9.1.2
- React Three Drei 10.0.7
- TypeScript 5
- TailwindCSS 4
- DaisyUI 5.0.28
