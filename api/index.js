const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send("provided url -> `?url=[request url]`");
  }

  try {
    const response = await axios({
      method: "GET",
      url: targetUrl,
      responseType: "stream", // Get the response as a stream
    });

    res.status(response.status); // Set status code
    response.data.pipe(res); // Stream response back to client
  } catch (error) {
    res.status(500).send(`error: ${error.message}`);
  }
});

app.listen(3000, () => {
  console.log("Proxy Server running on http://localhost:3000");
});

// const express = require("express");
// const { createProxyServer } = require("http-proxy");

// const app = express();
// const proxy = createProxyServer({});
// const PORT = 4000;

// app.use((req, res) => {
//   const targetUrl = req.query.url; // URL ကို query string မှယူ
//   if (!targetUrl) {
//     return res.status(400).json({ error: "Missing 'url' query parameter" });
//   }

//   console.log(`Proxying request to: ${targetUrl}`);
//   proxy.web(req, res, { target: targetUrl, changeOrigin: true }, (err) => {
//     console.error("Proxy error:", err);
//     res.status(500).json({ error: "Proxy request failed" });
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Proxy server running on http://localhost:${PORT}`);
// });

// module.exports = app;

// const express = require("express");
// const app = express();

// app.get("/", (req, res) => res.send("Express on Vercel"));

// app.listen(5000, () => console.log("Server ready on port 3000."));

// module.exports = app;
