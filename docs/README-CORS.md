# CORS Configuration for Development

This project has been configured to handle CORS (Cross-Origin Resource Sharing) for development. Here are the available options:

## Option 1: Parcel Proxy (Recommended)

The project includes a `parcel.config.js` configuration that proxies API requests to avoid CORS issues entirely.

**How it works:**

- API requests to `/api/*` are automatically proxied to `http://localhost:8006`
- No CORS headers needed on the server
- Works seamlessly in development

**Usage:**

```bash
npm start
```

## Option 2: Environment Variables

You can configure the API URL using environment variables:

**For local development with proxy:**

```bash
npm start
```

**For direct remote API access:**

```bash
npm run start:remote
```

Or set the environment variable manually:

```bash
VITE_API_URL=http://your-remote-api.com npm start
```

## Option 3: Server-Side CORS (Backend)

The FastAPI backend (`serve.py`) has been updated with CORS middleware that allows requests from:

- `http://localhost:1234` (Parcel default)
- `http://localhost:3000` (Alternative port)
- `http://127.0.0.1:1234`
- `http://127.0.0.1:3000`

If you need to add more origins, edit the `allow_origins` list in `serve.py`.

## Configuration Files

- `.parcelrc` - Basic Parcel configuration
- `parcel.config.js` - Parcel proxy configuration
- `src/vite-env.d.ts` - TypeScript environment variable types
- `serve.py` - FastAPI CORS middleware

## Troubleshooting

1. **CORS errors still occurring**: Make sure you're using the proxy (`/api`) or the server has CORS enabled
2. **API not responding**: Check that your backend server is running on the correct port
3. **Environment variables not working**: Ensure you're using the `VITE_` prefix for Parcel
4. **Parcel config errors**: Make sure you have the latest version of Parcel installed
