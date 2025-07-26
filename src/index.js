const express = require('express');
const ping = require('ping');
const cors = require('cors');
const fs = require('fs');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3838;

// --- Configuração do Prometheus ---
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Novas métricas com labels
const pingLatency = new client.Gauge({
  name: 'ping_latency_seconds',
  help: 'Latência do ping em segundos para um host específico',
  labelNames: ['host', 'networkName']
});

const pingStatus = new client.Gauge({
  name: 'ping_status_up',
  help: 'Status do host (1 para online, 0 para offline)',
  labelNames: ['host', 'networkName']
});

// Endpoint de Métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
// --- Fim da Configuração do Prometheus ---


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
    // Usamos um timeout para evitar que a aplicação fique presa
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
        const labels = { host: host.host, networkName: host.networkName };

        // Atualiza as métricas do Prometheus
        pingLatency.set(labels, pingResult.time !== null ? pingResult.time / 1000 : 0);
        pingStatus.set(labels, pingResult.alive ? 1 : 0);

        return {
          networkName: host.networkName,
          host: host.host,
          alive: pingResult.alive,
          time: pingResult.time || null,
        };
      })
    );
    res.json(results);
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