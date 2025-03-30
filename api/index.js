const express = require("express");
const { createProxyServer } = require("http-proxy");

const app = express();
const proxy = createProxyServer({});
const PORT = 5000;

app.use((req, res) => {
  const targetUrl = req.query.url; // URL ကို query string မှယူ
  if (!targetUrl) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  console.log(`Proxying request to: ${targetUrl}`);
  proxy.web(req, res, { target: targetUrl, changeOrigin: true }, (err) => {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy request failed" });
  });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});

module.exports = app;


// const express = require("express");
// const app = express();

// app.get("/", (req, res) => res.send("Express on Vercel"));

// app.listen(5000, () => console.log("Server ready on port 3000."));

// module.exports = app;