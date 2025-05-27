const fp = require("path");
const express = require("express");
const Fuse = require("fuse.js");
const app = express();
const port = 3000;

const db = require("./db.js");

db.initializeTable();

app.use(express.json());
app.use(express.urlencoded());

app.use(async function (req, res, next) {
  if (req.path === "/go" || req.path.startsWith("/go/")) {
    next();
    return;
  }

  let found = "https://kserver.uk/homelab-dashboard/assets/unavailable.svg";
  try {
    path = req.path.substring(1);

    if (path === "") {
      next();
      return;
    }

    const links = await db.getAllLinks();

    const fuse = new Fuse(links, {
      keys: ["key", "url"],
    });

    found = fuse.search(path);

    if (found === undefined || found.length === 0) {
      res.status(404);
      res.send(
        `No match for: ${path}<br/><br/>Available matches: ${links
          .map((link) => `${link.key}: ${link.url}`)
          .join("<br />")}`
      );
      next();
      return;
    }

    res.redirect(found[0].item.url);
  } catch (err) {
    console.error(err);
  }
  next();
});

app.get("/", (req, res) => {
  res.send("<a href='http://go'>Setup go links here!<a>");
});

app.get("/go", (req, res) => {
  res.sendFile(fp.join(__dirname + "/go.html"));
});

app.get("/go", (req, res) => {
  res.sendFile(fp.join(__dirname + "/go.html"));
});

app.get("/go/favicon", (req, res) => {
  res.sendFile(fp.join(__dirname + "/favicon.png"));
});

app.get("/go/links", async (req, res) => {
  res.send(await db.getAllLinks());
});

app.post("/go/links", async (req, res) => {
  const body = req.body;
  await db.addLink(body["path"].trim(), body["url"].trim());
  res.redirect("/go");
});

app.post("/go/links/delete", async (req, res) => {
  const body = req.body;
  await db.deleteLink(body.path);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
