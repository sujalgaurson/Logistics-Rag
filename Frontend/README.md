# Logistics Document AI

Frontend for the logistics document intelligence system. React + Vite + TypeScript with Tailwind CSS and a minimal SaaS-style dashboard.

## Prerequisites

- Node.js 18+
- Backend running at `http://localhost:8000`

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Ensure the FastAPI backend is running on port 8000.

## Build

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## API

The app talks to the backend at `http://localhost:8000`. If you hit CORS, add a proxy in `vite.config.ts` and point `api.ts` at the proxy path.

## Features

- **Upload**: Drag-and-drop or click to upload PDF/DOCX/TXT.
- **Ask**: Type a question, get an answer with confidence and optional supporting source text.
- **Extract**: One-click extraction of shipment fields into a table (nulls shown as "—").
- **Theme**: Dark/light toggle with preference stored in `localStorage`.
