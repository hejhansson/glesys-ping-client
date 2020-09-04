const express = require('express')
const bodyParser = require('body-parser')
const ping = require('ping')
const log = require('log-to-file')
const app = express()
const port = 7331

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send({ message: 'glesys ping client'})
})

app.post('/ping', async (req, res) => {  
  const url = req.body.url
  let pingResult = {}

  if(! url) res.status(500).send({ error: 'Needs url for ping' })

  await ping.promise.probe(url, { timeout: 10 })
    .then((result) => {
      pingResult = {
        host: url,
        alive: result.alive,
        time: result.alive ? `${result.time}ms` : null,
        ip: result.alive ? result.numeric_host : null
      }
    })

  res.send(pingResult)
})

app.listen(port)
