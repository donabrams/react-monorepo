import https from "https"
import fs from "fs"

const envKey = process.env.HTTPS_KEY ? fs.readFileSync(process.env.HTTPS_KEY) : null
const envCert = process.env.HTTPS_CERT ? fs.readFileSync(process.env.HTTPS_CERT) : null

export default function startHttpsServer({key=envKey, cert=envCert, handler=defaultHandler, onStart=()=>{}, port=443}) {
  const options = {
    key,
    cert,
    port,
  }
  const server = https.createServer(options, handler)
  server.listen(port, onStart)
  return server
}

function defaultHandler(req, res) {
  res.writeHead(200, {"Content-Type": "text/plain"})
  res.end("HTTPS server is up, but no handler specified.")
}
