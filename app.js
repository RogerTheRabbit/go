const fp = require("path");
const express = require("express");
const app = express();
const port = 3000;

const fs = require("node:fs");

app.use(function (req, res, next) {
  let url = "https://kserver.uk/homelab-dashboard/assets/unavailable.svg";
  try {
    const data = fs.readFileSync(fp.resolve(__dirname, "config.csv"), "utf8");
    const links = {};
    // Support new lines in windows and linux
    data.split(/[\r\n]+/).forEach((line) => {
      entry = line.split(",");
      if (entry.length == 2) {
        links[entry[0].trim()] = entry[1].trim();
      }
    });

    path = req.path.substring(1);

    if (path === "") {
      next();
      return;
    }

    if (links[path] === undefined) {
      res.status(404);
      res.send(
        `No match for: ${path}<br/><br/>Available matches: ${JSON.stringify(
          links
        )}`
      );
      next();
      return;
    }
    url = links[path];
    res.redirect(url);
  } catch (err) {
    console.error(err);
  }
  next();
});

app.get("/", (req, res) => {
  res.send("<a href='http://go'>Setup go links here!<a>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
