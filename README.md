# Ping Monitor: Full Stack de Monitoramento com DevOps


Um projeto completo de monitoramento de serviços que utiliza um stack moderno de DevOps para coletar, armazenar e visualizar métricas de latência e disponibilidade. Desenvolvido como um projeto prático para aplicar conceitos de Docker, CI/CD, Prometheus e Grafana.

---

##  Sobre o projeto

Este projeto simula um ambiente de monitoramento real, onde uma API customizada em Node.js verifica o status de uma lista de hosts via ping (ICMP). As métricas de latência e status (online/offline) são expostas em um endpoint `/metrics` e coletadas pelo Prometheus. O Grafana, por sua vez, consome esses dados para gerar dashboards visuais e intuitivos.

Todo o ambiente é orquestrado com Docker Compose e um pipeline de CI/CD com GitHub Actions automatiza o build e a publicação das imagens Docker no Docker Hub.

---

## stack de tecnologias

* **Backend (API):** Node.js, Express.js, `prom-client`
* **Frontend:** HTML5, CSS3, JavaScript (servido via NGINX)
* **Banco de Dados de Métricas:** Prometheus
* **Visualização:** Grafana
* **Containerização e Orquestração:** Docker, Docker Compose
* **CI/CD:** GitHub Actions
* **Registro de Imagens:** Docker Hub

---

## 🚀 Funcionalidades

* **Monitoramento em Tempo Real:** Verifica o status e a latência de múltiplos hosts.
* **Métricas Customizadas:** A API expõe as métricas `ping_status_up` e `ping_latency_seconds`.
* **Dashboards Visuais:** Painéis no Grafana para uma análise clara e rápida dos dados.
* **Ambiente 100% Containerizado:** Todos os serviços (API, Frontend, Prometheus, Grafana) rodam em contêineres Docker isolados.
* **Pipeline de CI/CD Automatizado:** A cada `push` em branches específicas, as imagens Docker são automaticamente construídas e publicadas no Docker Hub.

---

## ⚙️ Como Executar Localmente

### Pré-requisitos

* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/products/docker-desktop/)
* [Docker Compose](https://docs.docker.com/compose/)

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/WellingtonSilva12/ping-monitor-api-devops.git
    cd SEU-REPOSITORIO
    ```

2.  **Configure os hosts a serem monitorados:**
    Crie um arquivo `hosts.json` na raiz do projeto com os hosts que deseja monitorar.
    ```json
    [
      { "networkName": "Google DNS", "host": "8.8.8.8" },
      { "networkName": "Cloudflare DNS", "host": "1.1.1.1" }
    ]
    ```

3.  **Configure as variáveis de ambiente:**
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

4.  **Inicie a aplicação:**
    Use o Docker Compose para baixar as imagens do Docker Hub e iniciar todos os contêineres.
    ```bash
    docker-compose up -d
    ```

5.  **Acesse os serviços:**
    * **Frontend:** [http://localhost](http://localhost)
    * **Grafana:** [http://localhost:3000](http://localhost:3000) (login: `admin`/`admin`)
    * **Prometheus:** [http://localhost:9090](http://localhost:9090)

---

##  CI/CD

Este projeto utiliza GitHub Actions para automação de build e publicação de imagens. O workflow está definido em `.github/workflows/build-and-push.yml`.

O desenvolvimento da pipeline foi realizado na branch `ci-cd-docker`. O gatilho (`on:`) do workflow foi configurado para rodar automaticamente em cada `push` para branches específicas, como `main` e `ci-cd-docker`. Isso permite testar o pipeline na branch de desenvolvimento antes de integrar à branch principal.

Um exemplo de configuração de gatilho no workflow seria:
```yaml
on:
  push:
    branches: [ "main", "ci-cd-docker" ] # Roda em pushes para a branch principal e para a de desenvolvimento
  pull_request:
    branches: [ "main" ] # Roda também para validar Pull Requests enviados para a main
```
A cada execução, o pipeline realiza as seguintes tarefas:

 - Faz login seguro no Docker Hub usando os Secrets do repositório.
- Constrói as imagens Docker para a API e para o Frontend.
- Publica as novas imagens com a tag :latest no Docker Hub.

