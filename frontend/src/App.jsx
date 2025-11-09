import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from './TaskForm.jsx';
import './App.css';

// Endereço fixo do backend durante desenvolvimento
const API_URL = 'http://localhost:8080/tasks';

// Variável global para gerenciar o feedback na tela (modais de confirmação/erro)
let setGlobalFeedback;

/* Componente: Coluna do Kanban */
function KanbanColumn({ title, tasks, onUpdate, onDelete }) {
  // Define a transição natural: a_fazer -> em_progresso -> concluidas
  const nextStatus = {
    'a_fazer': 'em_progresso',
    'em_progresso': 'concluidas',
  };

  const prevStatus = {
    'em_progresso': 'a_fazer',
    'concluidas': 'em_progresso',
  };

  const handleAdvance = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newStatus = nextStatus[task.status];
    if (newStatus) onUpdate(taskId, newStatus);
  };

  const handleDelete = (taskId) => {
    if (setGlobalFeedback) {
      setGlobalFeedback({
        message: `Quer mesmo apagar a tarefa ${taskId}? Essa ação é permanente.`,
        type: 'confirm',
        action: () => onDelete(taskId),
      });
    }
  };

  return (
    <div className="kanban-column">
      <h2>{title} ({tasks.length})</h2>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-card status-${task.status}`}>
            <h3>{task.titulo}</h3>
            <p>{task.descricao}</p>

            <div className="task-actions">
              <div className="actions-left">
                <button onClick={() => handleDelete(task.id)} className="delete-button">Apagar</button>
              </div>
              <div className="actions-right">
                {task.status !== 'concluidas' && (
                  <button onClick={() => handleAdvance(task.id)} className="move-right">Avançar &gt;&gt;</button>
                )}
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (<p className="empty-message">Nada para fazer aqui!</p>)}
      </div>
    </div>
  );
}


/* Componente Principal: O Nosso App Kanban */
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Disponibiliza setter global para colunas solicitarem confirmações
  setGlobalFeedback = setFeedback;

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
      setFeedback(null);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      setFeedback({ message: 'ERRO GRAVE: Não consegui me conectar com o Backend Go (porta 8080). Ligue o servidor Go!', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskStatus = useCallback(async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('A API falhou ao mudar o status.');
      fetchTasks();
      setFeedback({ message: 'Tarefa movida com sucesso!', type: 'success' });
    } catch (error) {
      console.error('Erro ao mover tarefa:', error);

      // Mensagem mais amigável quando a falha é do tipo 'Failed to fetch'
      if (error && error.message && error.message.toLowerCase().includes('failed to fetch')) {
        // Verifica se o backend responde ao GET /tasks — isso ajuda a distinguir
        // entre problema de rede (servidor off) e problema de CORS/preflight.
        try {
          const ping = await fetch(API_URL, { method: 'GET' });
          if (!ping.ok) {
            setFeedback({ message: 'Falha ao conectar com a API (GET retornou erro). Verifique o servidor Go.', type: 'error' });
          } else {
            setFeedback({ message: 'Falha ao enviar PUT — possível bloqueio CORS ou preflight. Abra o console do navegador (F12) e verifique a requisição OPTIONS/PUT.', type: 'error' });
          }
        } catch (e) {
          setFeedback({ message: 'ERRO DE REDE: Não consegui falar com o servidor. Verifique se o servidor Go está em execução na porta 8080.', type: 'error' });
        }
      } else {
        setFeedback({ message: `Oops! Erro ao mover: ${error.message}`, type: 'error' });
      }
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.status === 404) throw new Error('Essa tarefa não existe mais.');
      if (!response.ok && response.status !== 204) throw new Error('Falha na exclusão.');
      fetchTasks();
      setFeedback({ message: `Tarefa ${id} apagada para sempre!`, type: 'success' });
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      setFeedback({ message: `Erro ao apagar tarefa: ${error.message}`, type: 'error' });
    }
  }, [fetchTasks]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const todoTasks = tasks.filter(task => task.status === 'a_fazer');
  const inProgressTasks = tasks.filter(task => task.status === 'em_progresso');
  const doneTasks = tasks.filter(task => task.status === 'concluidas');

  const closeFeedback = () => setFeedback(null);
  const executeConfirmedAction = () => { if (feedback && feedback.action) feedback.action(); setFeedback(null); };

  return (
    <div className="kanban-board">
      {feedback && (
        <div className={`feedback-message ${feedback.type}`}>
          <p>{feedback.message}</p>
          {feedback.type === 'confirm' ? (
            <div className="confirm-actions">
              <button onClick={executeConfirmedAction} className="btn-confirm">Sim, Apagar</button>
              <button onClick={closeFeedback} className="btn-cancel">Cancelar</button>
            </div>
          ) : (
            <button onClick={closeFeedback} className="btn-close">X</button>
          )}
        </div>
      )}

      <h1>Meu Kanban Simples e Funcional (React + Go)</h1>

      <TaskForm onTaskCreated={fetchTasks} />

      <hr />

      {loading && <p className="loading-message">Procurando tarefas no servidor...</p>}

      {!loading && (
        <div className="columns-container">
          <KanbanColumn title="🎯 A Fazer" tasks={todoTasks} onUpdate={updateTaskStatus} onDelete={deleteTask} />
          <KanbanColumn title="🚧 Em Progresso" tasks={inProgressTasks} onUpdate={updateTaskStatus} onDelete={deleteTask} />
          <KanbanColumn title="✅ Concluídas" tasks={doneTasks} onUpdate={updateTaskStatus} onDelete={deleteTask} />
        </div>
      )}
    </div>
  );
}

/* Componente: Card de tarefa isolado para gerenciar estado local (expand/collapse) */
function TaskCard({ task, onAdvance, onDelete, onUpdate }) {
  // Removido: TaskCard component não é mais usado. Mantemos a definição mínima
  // para evitar erros caso ainda seja importado em algum lugar.
  return null;
}