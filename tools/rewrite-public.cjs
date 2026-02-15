#!/usr/bin/env node
/*
 * Workaround for old Hexo 3 writer incompatibility on modern Node runtimes.
 * Hexo generates valid route streams, but some written files become 0-byte.
 * This script rewrites files from hexo.route to ensure on-disk output is correct.
 */

const fs = require('fs/promises');
const path = require('path');
const Hexo = require('hexo');

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }
  return Buffer.concat(chunks);
}

async function main() {
  const root = process.cwd();
  const hexo = new Hexo(root, { silent: true });

  await hexo.init();
  await hexo.call('generate');

  const publicDir = path.join(root, 'public');
  let count = 0;

  for (const routePath of hexo.route.list()) {
    const outPath = path.join(publicDir, routePath);
    await fs.mkdir(path.dirname(outPath), { recursive: true });

    const content = hexo.route.get(routePath);

    if (content == null) continue;

    if (typeof content === 'string') {
      await fs.writeFile(outPath, content, 'utf8');
      count += 1;
      continue;
    }

    if (Buffer.isBuffer(content)) {
      await fs.writeFile(outPath, content);
      count += 1;
      continue;
    }

    // Treat as Readable stream.
    const buf = await streamToBuffer(content);
    await fs.writeFile(outPath, buf);
    count += 1;
  }

  const indexFile = path.join(publicDir, 'index.html');
  const st = await fs.stat(indexFile);
  if (!st.size) {
    throw new Error('rewrite-public failed: public/index.html is still empty');
  }

  console.log(`[rewrite-public] Rewrote ${count} routes. index.html=${st.size} bytes`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
