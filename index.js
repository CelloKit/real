import express from "express";
import http from "node:http";
import path from "node:path";
import { createBareServer } from "@tomphttp/bare-server-node";
import request from "@cypress/request";

const __dirname = path.resolve();
const server = http.createServer();
const app = express(server);
const bareServer = createBareServer("/bare/");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "static")));
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});
app.get('/student', (req, res) => {
  res.sendFile(path.join(__dirname, './loader.html'));
});

app.get('/', (req, res) => {
  res.redirect("./app")
})
server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.on("listening", () => {
  console.log(`Skibidi Indians!!!! Port 8000`);
});

server.listen({
  port: 8000,
});