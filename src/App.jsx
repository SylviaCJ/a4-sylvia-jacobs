import { useEffect, useState } from 'react'
import '@picocss/pico/css/pico.min.css';

const emptyForm = { task: '', creationDate: '', deadline: '', status: 'not started' }

function App() {
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    fetch('/data').then((response) => response.json()).then(setTasks)
  }, [])

  const submitTask = async (event) => {
    event.preventDefault()
    const response = await fetch('/data', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    setTasks(await response.json())
    setForm(emptyForm)
  }

  const deleteTask = async (id) => {
    const response = await fetch(`/delete/${id}`, { method: 'DELETE' })
    setTasks(await response.json())
  }

  const saveEdit = async (event) => {
    event.preventDefault()
    const response = await fetch(`/edit/${editingTask.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingTask),
    })
    setTasks(await response.json())
    setEditingTask(null)
  }

  return (
    <>
    <style>{`
      body {
        font-size: 14px;
      }
    `}</style>
    <div className="container">
    <main className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      <section className="workspace">
        <table>
          <thead><tr><th>Task</th><th>Creation Date</th><th>Deadline</th><th>Status</th><th>Days</th><th>Actions</th></tr></thead>
          <tbody>{tasks.map((item) => <tr key={item.id}>
            <td>{item.task}</td><td>{item.creationDate}</td><td>{item.deadline}</td><td>{item.status}</td><td>{item.timeToComplete}</td>
            <td><button type="button" onClick={() => setEditingTask({ ...item })}>Edit</button>{' '}<button type="button" onClick={() => deleteTask(item.id)}>Delete</button></td>
          </tr>)}</tbody>
        </table>
        </section>
        <section>
        {!editingTask &&  
        <form onSubmit={submitTask}>
          <h2>Add Task</h2>
          <label>Task <input name="task" value={form.task} onChange={(event) => setForm({ ...form, task: event.target.value })} required /></label>
          <label>Creation Date <input type="date" name="creationDate" value={form.creationDate} onChange={(event) => setForm({ ...form, creationDate: event.target.value })} required /></label>
          <label>Deadline <input type="date" name="deadline" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} required /></label>
          <label>Status <select name="status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="not started">Not Started</option><option value="in progress">In Progress</option><option value="completed">Completed</option></select></label>
          <button type="submit">Add Task</button>
        </form>}
        {editingTask && <form className="editor" onSubmit={saveEdit}>
          <h2>Edit Task</h2>
          <label>Task <input value={editingTask.task} onChange={(event) => setEditingTask({ ...editingTask, task: event.target.value })} required /></label>
          <label>Deadline <input type="date" value={editingTask.deadline} onChange={(event) => setEditingTask({ ...editingTask, deadline: event.target.value })} required /></label>
          <label>Status <select value={editingTask.status} onChange={(event) => setEditingTask({ ...editingTask, status: event.target.value })}><option value="not started">Not Started</option><option value="in progress">In Progress</option><option value="completed">Completed</option></select></label>
          <button type="submit">Save Changes</button><button type="button" onClick={() => setEditingTask(null)}>Cancel</button>
        </form>}
      </section>
    </main>
    </div>
    </>
  )
}

export default App
