const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..", "..");
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
};

function send(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, headers);
  response.end(body);
}

const server = http.createServer((request, response) => {
  const requestPath = new URL(request.url, `http://${request.headers.host}`)
    .pathname;
  const safePath = path
    .normalize(decodeURIComponent(requestPath))
    .replace(/^(\.\.[/\\])+/, "");
  const relativePath =
    safePath === "/" ? "CAPMap.html" : safePath.replace(/^[/\\]+/, "");
  const filePath = path.join(rootDir, relativePath);

  if (!filePath.startsWith(rootDir)) {
    send(response, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, fileBuffer) => {
    if (error) {
      send(response, 404, "Not Found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    send(response, 200, fileBuffer, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static server listening on http://127.0.0.1:${port}`);
});
