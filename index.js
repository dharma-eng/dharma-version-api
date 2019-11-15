const express = require('express')
const axios = require('axios')
const jq = require('node-jq')

const port = process.env.PORT || 8080
const infuraAPIKey = process.env.INFURA_API_KEY
const infuraEndpoint = 'https://mainnet.infura.io/v3/' + infuraAPIKey
const smartWalletPayload = {
  "jsonrpc": "2.0",
  "method": "eth_call",
  "params": [
    {
      "to": "0x00000000054e5a7F91DB6B7DB5E91eaB56FaC5E4",
      "gas": "0xaaaa",
      "data": "0xc0b667ee"
    },
    "latest"
  ],
  "id": 1
}
const keyRingPayload = {
  "jsonrpc": "2.0",
  "method": "eth_call",
  "params": [
    {
      "to": "0x00000000054e5a7F91DB6B7DB5E91eaB56FaC5E4",
      "gas": "0xaaaa",
      "data": "0xcbbbb63a"
    },
    "latest"
  ],
  "id": 1
}
const smartWalletFilter = (
  '.result[56:66] | tonumber | ' +
  '{schemaVersion: 1, label: "Smart Wallet version", message: ., color: "blue"}'
)
const keyRingFilter = (
  '.result[56:66] | tonumber | ' +
  '{schemaVersion: 1, label: "Key Ring version", message: ., color: "orange"}'
)

const app = express()

app.get('/smart-wallet-version', async (req, res) => {
  const response = await axios.post(infuraEndpoint, smartWalletPayload)
  const transform = await jq.run(smartWalletFilter, response.data, {input: 'json'})
  return res.send(transform)
})

app.get('/key-ring-version', async (req, res) => {
  const response = await axios.post(infuraEndpoint, keyRingPayload)
  const transform = await jq.run(keyRingFilter, response.data, {input: 'json'})
  return res.send(transform)
})

app.listen(port, () =>
  console.log(`Listening on port ${port}`)
)