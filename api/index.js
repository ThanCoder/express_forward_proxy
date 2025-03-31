const express = require('express')
const axios = require('axios')

const app = express();
const PORT = 3000;

function getNameFromUrl(url){
  var name = url.split('/')[url.split('/').length-1];
  return name;
}
function getReadmeText(){
  return `
  provided 'bytes' -> ?url=["request url"] ;
  provided 'stream' -> /stream?url=["request url"]
  `;
}


app.get("/", async (req, res) => {
  const targetUrl = req.query.url; // Get URL from query parameters
  if (!targetUrl) {
    return res.status(400).send(getReadmeText());
  }

  try {
    // Fetch data as bytes
    const response = await axios({
      method: "GET",
      url: targetUrl,
      responseType: "arraybuffer", // Fetch as raw bytes
    });

    res.set(response.headers); // Copy headers from the original response
    res.status(response.status).send(response.data); // Send the binary response
    
  } catch (error) {
    res.status(500).send(`error: ${error.message}`);
  }
});

app.get("/stream", async (req, res) => {
  const targetUrl = req.query.url; // Get URL from query parameters
  if (!targetUrl) {
    return res.status(400).send(getReadmeText());
  }

  try {
     // Stream Data
     const response = await axios({
      method: "GET",
      url: targetUrl,
      responseType: "stream", // Stream response
    });

    // Set Headers (Pass through original response headers)
    res.writeHead(response.status, {
      ...response.headers,
      "Content-Disposition": `attachment; filename="${getNameFromUrl(targetUrl)}"`, // Optional
    });

    // Pipe Response (Streaming)
    response.data.pipe(res);
  } catch (error) {
    res.status(500).send(`error: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


