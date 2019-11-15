'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const jq = require('node-jq');

const infuraAPIKey = process.env.INFURA_API_KEY;
const infuraEndpoint = 'https://mainnet.infura.io/v3/' + infuraAPIKey;
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
};
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
};
const smartWalletFilter = (
  '.result[56:66] | tonumber | ' +
  '{schemaVersion: 1, label: "Smart Wallet version", message: ., color: "blue"}'
)
const keyRingFilter = (
  '.result[56:66] | tonumber | ' +
  '{schemaVersion: 1, label: "Key Ring version", message: ., color: "orange"}'
);

const router = express.Router();
router.get('/', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  const response = await axios.post(infuraEndpoint, smartWalletPayload)
  const transform = await jq.run(smartWalletFilter, response.data, {input: 'json'})
  res.write(transform);
  res.end();
});

router.get('/smart-wallet-version', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  const response = await axios.post(infuraEndpoint, smartWalletPayload)
  const transform = await jq.run(smartWalletFilter, response.data, {input: 'json'})
  res.write(transform);
  res.end();
});

router.get('/key-ring-version', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  const response = await axios.post(infuraEndpoint, keyRingPayload)
  const transform = await jq.run(keyRingFilter, response.data, {input: 'json'})
  res.write(transform);
  res.end();
});

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
