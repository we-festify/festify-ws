import fs from 'node:fs/promises';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : '';

// Create http server
const app = express();

// backend proxy
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
  }),
);

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

app.use(express.static('public'));

app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');
    const nonce = res.locals.nonce;

    /** @type {string} */
    let template;
    /** @type {import('./src/entry-server.tsx').render} */
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('./src/entry-server.tsx')).render;
    } else {
      template = templateHtml;
      render = (await import('./dist/frontend-server/entry-server.js')).render;
    }

    const rendered = await render(url);

    let html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '');

    // add nonce to script tags
    html = html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      (match) => {
        return match.replace('></script>', `nonce="${nonce}"></script>`);
      },
    );

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {
  console.log(`Frontend Server started at http://localhost:${port}`);
});
