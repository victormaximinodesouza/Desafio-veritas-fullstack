# 🎯 Desafio Fullstack Veritas: Gerenciador de Tarefas

<p align="center">
  <img src="https://img.shields.io/badge/Go-1.20%2B-00ADD8?style=for-the-badge&logo=go" alt="Go 1.20+ Badge">
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react" alt="React + Vite Badge">
  <img src="https://img.shields.io/badge/Fullstack-API%20%26%20UI-30363D?style=for-the-badge&logo=github" alt="Fullstack Badge">
</p>

Este projeto é uma demonstração de uma aplicação fullstack, onde implementei um **Gerenciador de Tarefas (To-Do List)**.

## 💡 Arquitetura e Estrutura

O desafio foi resolvido com uma arquitetura de serviços separados, evidenciando habilidades em comunicação entre frontend e backend (via **CORS**).

| Componente | Localização | Tecnologias Chave | Funcionalidade Principal |
| :--- | :--- | :--- | :--- |
| **Backend (API)** | `backend/` | **Go (>= 1.20)**, REST | Servir a API (`/tasks`) e gerenciar a lógica de dados. |
| **Frontend (UI)** | `frontend/` | **React**, **Vite**, **npm** | Renderização da UI e consumo da API backend. |

## 🚀 Como Executar o Projeto (Desenvolvimento Local)

### Pré-requisitos

Certifique-se de que as seguintes dependências estão instaladas:

* ✅ **Go** (versão **>= 1.20**)
* ✅ **Node.js** e **npm**

### 1. ⚙️ Início Rápido (Recomendado para Windows)

Use o script na raiz para iniciar ambos os serviços automaticamente em janelas separadas:

```powershell
.\start-dev.bat
