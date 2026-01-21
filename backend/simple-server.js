const express = require("express");
const app = express();
app.get("/test", (req, res) => res.json({ ok: true }));
app.listen(5000, "127.0.0.1", () => {
  console.log("Simple server listening on port 5000");
});
