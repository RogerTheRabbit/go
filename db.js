const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("links.db");

function initializeTable() {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='links';",
      (err, rows) => {
        if (err) {
          console.error("Failed to check if links table exists:", err);
          reject(err);
        } else {
          if (rows.length === 0) {
            console.log("Links table doesn't exist, creating!");
            db.run("CREATE TABLE links (key text NOT NULL, url text NOT NULL)");
          }
        }
      }
    );
  });
}

function getAllLinks() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM links", (err, links) => {
      if (err) reject(err);
      else resolve(links);
    });
  });
}

function addLink(key, link) {
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO links (key, url) VALUES (?, ?)", key, link, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function deleteLink(key) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM links WHERE key = (?)", key, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = {
  initializeTable,
  getAllLinks,
  addLink,
  deleteLink,
};
