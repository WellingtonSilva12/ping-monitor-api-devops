const express = require('express');
const ping = require('ping');
const cors = require('cors');
const fs = require('fs');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3838;

const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics();

const pingCounter = new client.Counter({
  name: 'ping_requests_total',
  help: 'Número total de pings realizados'
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});


app.use(cors());
app.use(morgan('combined'));

const loadHosts = () => {
  try {
    const data = fs.readFileSync('./hosts.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error('Erro ao carregar o arquivo hosts.json');
  }
};

const pingHost = async (host) => {
  try {
    return await ping.promise.probe(host, { timeout: 5 });
  } catch (err) {
    console.error(`Erro ao pingar o host ${host}:`, err.message);
    return { alive: false, time: null };
  }
};

app.get('/hosts', async (req, res, next) => {
  try {
    const hosts = loadHosts();
    const results = await Promise.all(
      hosts.map(async (host) => {
        const pingResult = await pingHost(host.host);
        return {
          networkName: host.networkName,
          host: host.host,
          alive: pingResult.alive,
          time: pingResult.time || null,
        };
      })
    );
    res.json(results);
    console.log(results);
  } catch (err) {
    next(err);
  }
});

app.get('/ping/:host', async (req, res, next) => {
  try {
    const host = req.params.host;
    const result = await pingHost(host);
    res.json({
      host: host,
      alive: result.alive,
      time: result.time,
    });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!', details: err.message });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});