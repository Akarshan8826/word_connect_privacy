"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT) || 3000;
const publicDirectory = path.join(__dirname, "public");
const routes = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/app-icon.png", ["app-icon.png", "image/png"]],
]);

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;

  if (pathname === "/health") {
    response.writeHead(200, {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    });
    response.end(JSON.stringify({ status: "ok", service: "word-connect-privacy" }));
    return;
  }

  const route = routes.get(pathname);
  if (!route) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { allow: "GET, HEAD" });
    response.end();
    return;
  }

  const [fileName, contentType] = route;
  fs.readFile(path.join(publicDirectory, fileName), (error, content) => {
    if (error) {
      console.error(`Unable to read ${fileName}:`, error);
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      response.end("Internal server error");
      return;
    }

    response.writeHead(200, {
      "content-type": contentType,
      "cache-control": fileName === "index.html" ? "no-cache" : "public, max-age=3600",
      "x-content-type-options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Word Connect privacy site listening on port ${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close((error) => {
      if (error) {
        console.error("Error while shutting down the server:", error);
        process.exitCode = 1;
      }
    });
  });
}
