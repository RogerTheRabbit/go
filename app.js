const fp = require("path");
const express = require("express");
const Fuse = require("fuse.js");
const app = express();
const port = 3000;

const fs = require("node:fs");
const data = fs.readFileSync(fp.resolve(__dirname, "config.csv"), "utf8");
const links = [];
// Support new lines in windows and linux
data.split(/[\r\n]+/).forEach((line) => {
  entry = line.split(",");
  if (entry.length == 2) {
    links.push({ key: entry[0].trim(), url: entry[1].trim() });
  }
});

app.use(express.json());
app.use(express.urlencoded());

app.use(function (req, res, next) {
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

app.get("/go/links", (req, res) => {
  res.send(links);
});

app.post("/go/links", (req, res) => {
  const body = req.body;
  links.push({ key: body["path"].trim(), url: body["url"].trim() });
});

app.delete("/go/links", (req, res) => {
  const body = req.body;
  links.push({ key: body["path"].trim(), url: body["url"].trim() });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
