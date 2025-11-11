Meu Projeto Kanban: Organizando as Tarefas
Olá! Este é o projeto que desenvolvi para o Desafio Fullstack da Veritas Consultoria Empresarial. Meu objetivo foi criar um painel simples, mas funcional, para gerenciar tarefas, como um Mini Kanban.

A aplicação é construída com React para a tela que você vê (o Frontend) e Go (Golang) para guardar e controlar os dados no servidor (o Backend).

O que a aplicação faz (O Essencial)
Você terá um quadro organizado em três etapas fixas:

A Fazer

Em Progresso

Concluídas

Na Sua Tela (Frontend)
Você pode adicionar novas tarefas, dando um título a elas e, se quiser, uma descrição.

Pode mudar a tarefa de coluna  (de "A Fazer" para "Em Progresso", por exemplo).

Se precisar, pode editar ou excluir qualquer tarefa.

Você verá avisos simples na tela quando o sistema estiver carregando algo ou se der algum erro.

Tudo o que você faz é guardado no servidor via uma comunicação padrão (API REST).

Nos Bastidores (Backend em Go)
O servidor Go é quem guarda as tarefas e faz a ponte entre o seu navegador e os dados.

Ele tem os "pontos de contato" necessários (endpoints RESTful) para criar, ler, atualizar e deletar (GET, POST, PUT, DELETE para /tasks).

Os dados estão sendo armazenados na memória, ou seja, enquanto o servidor estiver ligado.

Há uma checagem básica para garantir que toda tarefa tenha um título e que ela esteja em uma coluna válida.

Como Colocar o Projeto para Rodar
1. O que você precisa
Tenha o Go (para o servidor) e o Node.js/npm (para a tela) instalados na sua máquina.

2. Iniciando o Servidor (Go)
No seu terminal, vá para a pasta /backend.

Ligue o servidor com:

Bash

go run main.go
3. Iniciando a Tela (React)
Abra um novo terminal e vá para a pasta /frontend.

Instale os arquivos necessários:

Bash

npm install
Abra o aplicativo no seu navegador:

Bash

npm start
Organização do Código para Entrega
O projeto segue a estrutura solicitada:


/backend: Onde está o código Go (main.go, handlers.go, models.go).


/frontend: Onde está o código React (package.json, src/...).

/docs: Documentação importante. O arquivo user-flow.png (fluxo de uso) é obrigatório.



README.md: Este arquivo.

Minhas Escolhas e Próximos Passos
Por que estas escolhas?
Go (Backend): Escolhi Go por ser uma linguagem simples, robusta e muito eficiente para construir APIs rápidas.

React (Frontend): É excelente para criar interfaces que reagem rapidamente às ações do usuário.

O que pode melhorar (Limitações e Bônus)
Limitação Atual: Se o servidor Go for desligado, as tarefas salvas são perdidas, pois elas estão sendo guardadas apenas na memória.


Melhorias Futuras: Como passos opcionais (Bônus), pretendo implementar o recurso de arrastar e soltar as tarefas e salvar os dados em um arquivo JSON para que eles não se percam.