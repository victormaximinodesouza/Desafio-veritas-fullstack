package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

// task irá representar uma única tarefa no nosso kanban
type Task struct {
	ID        string `json:"id"`
	Titulo    string `json:"titulo"`
	Descricao string `json:"descricao"`
	Status    string `json:"status"`
}

// tasks armazena todas as tarefas. Usamos um 'map' para simular a base de dados
var tasks = make(map[string]Task) // armazenamento em memoria

// LISTAR TODAS AS TAREFAS GET / TASKS
func getTasks(w http.ResponseWriter, r *http.Request) {
	log.Println("Requisição GET /tasks recebida. buscando todas as tarefas")

	// Dizemos ao cliente que a respostas enviada será em formato JSON
	w.Header().Set("Content-Type", "application/json")

	// Convertemos o map de tarefas para uma lista
	var taskList []Task
	for _, task := range tasks {
		taskList = append(taskList, task)
	}

	// transformamos a lista GO em uma string em JSON e enviamos a respostas como JSON
	if err := json.NewEncoder(w).Encode(taskList); err != nil {
		http.Error(w, "Erro ao produzir tarefas para JSON.", http.StatusInternalServerError)
		log.Println("Erro de produção, tente novamente", err)
	}
}

// CRIAÇÃO DE TAREFAS POST /tasks
func createTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var newTask Task

	if err := json.NewDecoder(r.Body).Decode(&newTask); err != nil {
		http.Error(w, "JSON inválido. Verifique o corpo da requisição.", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(newTask.Titulo) == "" {
		w.WriteHeader(http.StatusBadRequest)
		response := map[string]string{"erro": "O campo 'titulo' é obrigatório e não pode ser vazio."}
		json.NewEncoder(w).Encode(response)
		return
	}

	newTask.ID = uuid.New().String()
	if newTask.Status == "" {
		newTask.Status = "a_fazer"
	}

	tasks[newTask.ID] = newTask

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newTask)
	log.Printf("Tarefa criada. ID: %s", newTask.ID)
}

// Configuração de CORS
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// * permite que qualquer domínio, incluindo o frontend, acesse a API
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// Informamos quais métodos HTTP são permitidos
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// Quais cabeçalhos o cliente pode usar
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Se a requisição for um "pre-flight" (OPTIONS), apenas respondemos OK e terminamos.
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// se não for OPTIONS
		next.ServeHTTP(w, r)
	})
}

// updateTask: Encontra uma tarefa por ID e permite atualizar o título, descrição ou STATUS.
func updateTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	id := vars["id"]

	existingTask, ok := tasks[id]
	if !ok {
		http.Error(w, "Tarefa não encontrada.", http.StatusNotFound)
		return
	}

	var updatedTaskData Task
	if err := json.NewDecoder(r.Body).Decode(&updatedTaskData); err != nil {
		http.Error(w, "Dados de atualização inválidos.", http.StatusBadRequest)
		return
	}

	// Validação do Status (Requisito: Status válido)
	validStatus := map[string]bool{"a_fazer": true, "em_progresso": true, "concluidas": true}

	if updatedTaskData.Status != "" && !validStatus[updatedTaskData.Status] {
		w.WriteHeader(http.StatusBadRequest)
		response := map[string]string{"erro": "Status inválido. Use 'a fazer', 'em progresso' ou 'concluidas'."}
		json.NewEncoder(w).Encode(response)
		return
	}

	// Aplica as mudanças, se os campos foram fornecidos.
	if updatedTaskData.Titulo != "" {
		existingTask.Titulo = updatedTaskData.Titulo
	}
	if updatedTaskData.Descricao != "" {
		existingTask.Descricao = updatedTaskData.Descricao
	}
	if updatedTaskData.Status != "" {
		existingTask.Status = updatedTaskData.Status
	}

	// Salva a tarefa atualizada.
	tasks[id] = existingTask

	json.NewEncoder(w).Encode(existingTask)
	log.Printf("Tarefa atualizada. ID: %s", id)
}

// deleteTask: Remove uma tarefa do armazenamento usando o ID da URL.
func deleteTask(w http.ResponseWriter, r *http.Request) {
	// Pega o ID da URL.
	vars := mux.Vars(r)
	id := vars["id"]

	// Checa se a tarefa existe. Se não, retorna 404.
	_, ok := tasks[id]
	if !ok {
		http.Error(w, "Tarefa não encontrada.", http.StatusNotFound)
		return
	}

	// Remove a tarefa do nosso map.
	delete(tasks, id)

	// Retorna 204 No Content (resposta padrão para exclusão bem-sucedida).
	w.WriteHeader(http.StatusNoContent)
	log.Printf("Tarefa excluída. ID: %s", id)
}

// PONTO DE ENTRADA
func main() {
	// Extrair dados iniciais para testar o get

	// Concluída
	id1 := uuid.New().String()
	tasks[id1] = Task{
		ID:        id1,
		Titulo:    "Implementar Listagem de Tarefas get e tasks",
		Descricao: "Criar o Handler e configurar o CORS para o frontend acessar.",
		Status:    "concluidas",
	}

	// Em Progresso (Simula a tarefa atual que estamos desenvolvendo)
	id2 := uuid.New().String()
	tasks[id2] = Task{
		ID:        id2,
		Titulo:    "Desenvolver criação de tarefas POST",
		Descricao: "Criar a função handler para receber dados JSON e validar o campo 'Titulo'.",
		Status:    "em_progresso",
	}

	// A Fazer (Simula uma tarefa ainda pendente no Kanban)
	id3 := uuid.New().String()
	tasks[id3] = Task{
		ID:        id3,
		Titulo:    "Configurar Frontend React",
		Descricao: "Estruturar o projeto React e instalar pacotes necessários.",
		Status:    "a_fazer", // Status que representa a coluna "A Fazer"
	}

	// 1. Inicializa o roteador
	router := mux.NewRouter()

	// 2. Aplica o middleware CORS
	router.Use(enableCORS)

	// 3. Mapeia as ROTAS CRUD COMPLETAS:
	router.HandleFunc("/tasks", getTasks).Methods("GET")
	router.HandleFunc("/tasks", createTask).Methods("POST")

	// Rotas que usam o ID da tarefa na URL:
	router.HandleFunc("/tasks/{id}", updateTask).Methods("PUT")
	router.HandleFunc("/tasks/{id}", deleteTask).Methods("DELETE")

	// Garantir que OPTIONS também sejam aceitos para preflight CORS nas mesmas rotas
	router.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}).Methods("OPTIONS")
	router.HandleFunc("/tasks/{id}", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}).Methods("OPTIONS")

	// Raiz amigável para evitar 404 quando alguém abre http://localhost:8080/
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte("API Go rodando. Use /tasks para acessar os endpoints."))
	}).Methods("GET")

	log.Println("Servidor iniciado! API: http://localhost:8080/tasks")
	log.Fatal(http.ListenAndServe(":8080", router))
}
