# 🔍 Ping Monitor – Full Stack de Monitoramento com DevOps

Projeto completo de monitoramento de hosts via ping com stack DevOps moderno, incluindo Node.js, Docker, Prometheus, Grafana e CI/CD com GitHub Actions. Ideal como aplicação prática de conceitos de observabilidade e automação com infraestrutura como código.

---

## 📌 Visão Geral

O Ping Monitor simula um ambiente real de monitoramento de disponibilidade e latência de serviços. A API customizada realiza verificações ICMP (ping) a uma lista de hosts, expondo os dados em /metrics para coleta pelo Prometheus. Em seguida, o Grafana transforma essas métricas em dashboards visuais e interativos.

Todo o sistema é orquestrado com Docker Compose, e o pipeline CI/CD com GitHub Actions cuida do build e publicação das imagens Docker no Docker Hub.

---

## 🧰 Stack Tecnológica

* **Backend (API):** Node.js, Express.js, `prom-client`
* **Frontend:** HTML5, CSS3, JavaScript (servido via NGINX)
* **Banco de Dados de Métricas:** Prometheus
* **Visualização:** Grafana
* **Containerização e Orquestração:** Docker, Docker Compose
* **CI/CD:** GitHub Actions
* **Registro de Imagens:** Docker Hub

---

## ✅ Funcionalidades

* **🔎 Monitoramento em Tempo Real:** Verifica o status e a latência de múltiplos hosts.
* **📊 Exposição de Métricas Customizadas:** A API expõe as métricas `ping_status_up` e `ping_latency_seconds`.
* **🖥️ Dashboards com Grafana:** Painéis no Grafana para uma análise clara e rápida dos dados.
* **📦 Ambiente Containerizado:** Todos os serviços (API, Frontend, Prometheus, Grafana) rodam em contêineres Docker isolados.
* **🤖 CI/CD Automatizado:** Build e push das imagens Docker a cada ``push`` para branches configuradas.

---

## ⚙️ Como Executar Localmente

### ✅ Pré-requisitos

* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/products/docker-desktop/)
* [Docker Compose](https://docs.docker.com/compose/)

### 🚀 Passos de Execução

1. **Clone o repositório:**

    ```bash

    git clone <https://github.com/WellingtonSilva12/ping-monitor-api-devops.git>
    cd ping-monitor-api-devops

    ```

2.  **Configure os hosts a serem monitorados:**
    Crie um arquivo `hosts.json` na raiz do projeto com os hosts que deseja monitorar.
    ```json
    [
      { "networkName": "Google DNS", "host": "8.8.8.8" },
      { "networkName": "Cloudflare DNS", "host": "1.1.1.1" }
    ]
    ```

3. **Variáveis de Ambiente (opcional):**
    No arquivo `docker-compose.yml`, substitua `SEU_USUARIO_DOCKERHUB` pelo seu nome de usuário real ou, como boa prática, crie um arquivo `.env` na raiz do projeto:

    **Arquivo `.env`:**

    ```
    DOCKERHUB_USERNAME=seu-usuario-dockerhub
    ```

    **E ajuste o `docker-compose.yml` para usar a variável:**

    ```yaml
    # ...
    services:
      frontend:
        image: ${DOCKERHUB_USERNAME}/ping-frontend:latest
    # ...
      api:
        image: ${DOCKERHUB_USERNAME}/ping-api:latest
    # ...
    ```

4. **Inicie a aplicação:**
    Use o Docker Compose para baixar as imagens do Docker Hub e iniciar todos os contêineres.

    ```bash
    docker-compose up -d
    ```

5. **Acesse os serviços:**
    * **Api:** [http://localhost:3838/hosts](http://localhost:3838/hosts)
    * **Frontend:** [http://localhost:8089](http://localhost:8089)
    * **Grafana:** [http://localhost:3000](http://localhost:3000) (login: `admin`/`admin`)
    * **Prometheus:** [http://localhost:9090](http://localhost:9090)

---

## 🔁 CI/CD com GitHub Actions

Este projeto utiliza GitHub Actions para automação de build e publicação de imagens. O workflow está definido em `.github/workflows/build-and-push.yml`.

O desenvolvimento da pipeline foi realizado na branch `ci-cd-docker`. O gatilho (`on:`) do workflow foi configurado para rodar automaticamente em cada `push` para branches específicas, como `main` e `ci-cd-docker`. Isso permite testar o pipeline na branch de desenvolvimento antes de integrar à branch principal.

Um exemplo de configuração de gatilho no workflow seria:

```yaml
on:
  push:
    branches: [ "main", "ci-cd-docker" ] # Roda em pushes para a branch principal e para a de desenvolvimento
  pull_request:
    branches: [ "main" ] # Roda também para validar Pull Reque/sts enviados para a main
```

### ⚙️ Etapas do Pipeline:

* Faz login seguro no Docker Hub usando os Secrets do repositório.
* Constrói as imagens Docker para a API e para o Frontend.
* Publica as novas imagens com a tag :latest no Docker Hub.
