# Desafio Veritas - Fullstack

Instruções rápidas para rodar o projeto localmente (Windows PowerShell)

Pré-requisitos
- Go (>= 1.20) instalado e no PATH
- Node.js + npm

Rodando manualmente (duas janelas de terminal)

1) Backend (API Go)
```powershell
cd "c:\Users\maxim\OneDrive\Área de Trabalho\desafio_veritas_fullstack\backend"
go run .
```
O backend roda em `http://localhost:8080` (API em `/tasks`).

2) Frontend (Vite + React)
```powershell
cd "c:\Users\maxim\OneDrive\Área de Trabalho\desafio_veritas_fullstack\frontend"
npm install   # se ainda não instalou
npm run dev    # por padrão irá usar a porta 5173
```
Abra o frontend em `http://localhost:5173/`.

Script automático (Windows)
- Há um arquivo `start-dev.bat` na raiz que abre duas janelas de terminal e inicia backend + frontend.

Notas
- A API usa CORS permitindo o acesso do frontend durante o desenvolvimento.
- Se ver uma mensagem de "ERRO DE REDE" na UI, abra DevTools (F12) → Console e Network e verifique a requisição para `/tasks`.
- Se precisar forçar outra porta no frontend, edite `frontend/package.json` no script `dev`.
