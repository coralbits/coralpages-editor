# Coralbits Universe Page Editor

The Page Editor is a React-based web application for editing and managing pages in the Coralbits Universe platform. It provides a user-friendly interface for listing, editing, and previewing pages, with support for custom elements and live updates.

## How to test

You need to run the three servers:

- Coralpages Server (https://github.com/coralbits/coralpages)
- Coralpages Editor (https://github.com/coralbits/coralpages-editor) (this ont)
- Coralpages Assets Manager (https://github.com/coralbits/coralpages-asset-manager) (this one is
  optional, but it's recommended to run it)

Then connect to the editor at http://localhost:8005/

## How to use in your own program

Coralpages Server, Editor and Assets Manager are microservices, and are not thought to be used
directly, but inside some frontend and api gateway.

Each server has a function, and you may not need the three in every setup. for example you may want
a just render pages setup, where you only need the Coralpages Server, but not the assets nor the
editor.

If you want it all, I recomend to use Docker Compose to run the three servers.

The editor can be used as a web component, which is very comfortable to use, just include the JS
file and a <page-editor> tag in your HTML file.

```html
<page-editor
  path="/my-page"
  css="./styles.css"
  cp_url="https://your-coralpages-server.com/cp/api/v1"
  am_url="https://your-coralpages-assets-manager.com/am/api/v1"
></page-editor>
```

But with thse component you are linking directly to AGPLv3 code, which may not be suitable for your
needs.

so you can also embed an iframe with the page editor, which is more flexible.

```html
<iframe
  src="http://localhost:8005/editor?path=/my-page&css=./styles.css&cp_url=https://your-coralpages-server.com/cp/api/v1&am_url=https://your-coralpages-assets-manager.com/am/api/v1"
>
  <p>Your browser does not support iframes.</p>
</iframe>
```

This allows you to use without linking the AGPLv3 code, so there should not be license infrigement
issues.. unless you modify the code or you dont want your users to know that you are using
coralpages.

For both there are optional arguments:

- `path`: The path of the page to edit
- `css`: The CSS file to load and apply within the Shadow DOM
- `cp_url`: The URL of the Coralpages Server API (default: `/cp/api/v1`, but you may want to change to `https://your-coralpages-server.com/cp/api/v1`)
- `am_url`: The URL of the Coralpages Assets Manager API (default: `/am/api/v1`, but you may want to change to `https://your-coralpages-assets-manager.com/am/api/v1`)

On both urls beware that is to the `/api/v1/` endpoint, not just the root of the server. As the normal
use is via some frontend and/or api gateway, you must configure it there to give access to the
page renderer and assets manager on the proper paths of your liking.

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

Page Viewer is licensed under the AGPLv3 license.

This basically means that any of your users, even on netowrk enviroments, have the
right to get the source code of the software and any modification.

If for any reason this is not acceptable to you or your company, it's possible to
purchase a commercial license from Coralbits, with a fixed closed price of 100€ per
release. This basically means that you can use the software with the only limitation
is that relicensing, redistribution nor resale are allowed.

If you need a commercial license, please contact us at info@coralbits.com.

More details at https://www.coralbits.com/coralpages/
