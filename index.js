const express = require('express')
const bodyParser = require('body-parser')
const ping = require('ping')
const log = require('log-to-file')
const app = express()
const port = 7331

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send(`glesys ping client`)
})

app.post('/ping', async (req, res) => {  
  try {
    const url = req.body.url
    let pingResult = {}

    await ping.promise.probe(url, { timeout: 10 })
      .then(result => {
        console.log(result)
        if(result.alive) {
          pingResult = {
            host: url,
            alive: result.alive,
            time: `${result.time}ms`,
            ip: result.numeric_host
          }
        } else {
          pingResult = {
            host: url,
            alive: result.alive,
          }
        }
    })

    res.send(pingResult)
  } catch(e) {
    res.send(e) 
  }
})

app.listen(port)
