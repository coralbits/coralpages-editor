# Coralbits Universe Page Editor

The Page Editor is a React-based web application for editing and managing pages in the Coralbits Universe platform. It provides a user-friendly interface for listing, editing, and previewing pages, with support for custom elements and live updates.

## Features

- **Page Listing:** Browse and search all available pages.
- **Page Editing:** Edit page content and structure using a visual editor.
- **Live Preview:** Instantly preview changes to your pages.
- **Download/Upload:** Export and import page data as JSON files.
- **API Integration:** Connects to a backend API for persistent storage.
- **Modern UI:** Built with React, TailwindCSS, and FontAwesome icons.

## Development

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm start
```

This uses Parcel with a proxy to the backend API (see CORS section below).

### Build for production

```bash
npm run build
```

## CORS and API Configuration

See `README-CORS.md` for details on handling CORS during development and deployment. The editor is configured to proxy API requests to avoid CORS issues.

## Project Structure

- `src/` - React source code (components, hooks, pages, utils)
- `Dockerfile` - Container setup for deployment
- `Makefile` - Common development commands
- `package.json` - Project dependencies and scripts

## License

See [LICENSE](./LICENSE) for license information.