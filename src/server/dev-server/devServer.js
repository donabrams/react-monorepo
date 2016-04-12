import startHttpsServer from "@donabrams/generic-server"

export default function startDevServer() {

  startHttpsServer({
    port: 8443,
    onStart: ()=>console.log('started on https://localhost:8443, yay!'),
    /*handler: (req, res) => {

    },*/
  })
}
