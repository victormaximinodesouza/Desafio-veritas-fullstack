import React, { useState } from 'react';

// Endereço da API para onde vamos enviar a nova tarefa
const API_URL = "http://localhost:8080/tasks";

/* Componente: Formulário para Adicionar Tarefas */
function TaskForm({ onTaskCreated }) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação de campos
    if (!titulo || !descricao) {
      setError("O título e a descrição são obrigatórios.");
      setLoading(false);
      return;
    }
    
    // Objeto da nova tarefa
    const newTask = {
      titulo,
      descricao,
      status: 'a_fazer', // Toda tarefa nova começa aqui
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST', // Usamos POST para criar algo novo
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("O servidor não aceitou a tarefa. Erro.");
      }

      // Sucesso! Limpa o formulário e pede para o App recarregar a lista
      setTitulo('');
      setDescricao('');
      if (onTaskCreated) {
        onTaskCreated(); 
      }
      
    } catch (e) {
      console.error("Erro ao enviar tarefa:", e);
      setError("ERRO DE REDE: Não consegui falar com o servidor. Verifique o Go.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>Adicionar Nova Tarefa ao Quadro</h3>
      {error && <p className="form-error">{error}</p>}
      
      <div className="form-group">
        <label htmlFor="titulo">Título Curto</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Fazer deploy do projeto"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="descricao">Detalhes da Tarefa</label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Revisar o código, testar as rotas PUT e DELETE..."
          required
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Adicionar Tarefa'}
      </button>
    </form>
  );
}

// Exportamos para que o App.jsx consiga usar este formulário
export default TaskForm;