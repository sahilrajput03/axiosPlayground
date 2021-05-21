const express = require('express')
const app = express()
const cors = require('cors')
const {log} = console

const PORT = 8080

app.disable('x-powered-by') // This is to disable x-powered-by header which is only useful if you are using 'helmet', and you must disable this header as the target hackers can launch application specific hacks on your server🤑︎.
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  console.log('asfs')
  return res.send("You made a get request on '/' endpoint.")
})

app.get('/a', (req, res) => {
  return res.status(201).send("You made 'get' request on '/a' endpoint.")
})

app.listen(PORT, function () {
  console.log('express running on :' + PORT)
})
