import { useState } from 'react'

export default function TodoList({ onTaskComplete, pomodoroCount }) {
  const [tasks, setTasks] = useState([])
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1)

  function addTask() {
    if (!newTaskName.trim()) return
    const task = {
      id: Date.now(),
      name: newTaskName,
      pomodoros: newTaskPomodoros,
      done: false,
    }
    setTasks(prev => [...prev, task])
    setNewTaskName('')
    setNewTaskPomodoros(1)
  }

  function toggleTask(id) {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          if (!t.done) onTaskComplete()
          return { ...t, done: !t.done }
        }
        return t
      })
    )
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="panel todo-panel">
      <h2>📋 To-Do List</h2>

      {}
      <div className="todo-add-row">
        <input
          type="text"
          placeholder="Task name..."
          value={newTaskName}
          onChange={e => setNewTaskName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
        />
        <input
          type="number"
          min="1"
          max="10"
          value={newTaskPomodoros}
          onChange={e => setNewTaskPomodoros(Number(e.target.value))}
          title="Pomodoros needed"
        />
        <button onClick={addTask}>Add</button>
      </div>

      {}
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={task.done ? 'task-item done' : 'task-item'}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
            />
            <span className="task-name">{task.name}</span>
            <span className="task-pomodoros">🍅×{task.pomodoros}</span>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>✕</button>
          </li>
        ))}
        {tasks.length === 0 && <li className="empty-msg">No tasks yet. Add one above!</li>}
      </ul>
    </div>
  )
}