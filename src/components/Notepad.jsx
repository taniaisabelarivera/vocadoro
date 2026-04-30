import { useState, useEffect } from 'react'

export default function Notepad() {
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('vocadoro-notes') ?? ''
  })

  useEffect(() => {
    localStorage.setItem('vocadoro-notes', notes)
  }, [notes])

  return (
    <div className="panel notepad-panel">
      <h2>Notepad</h2>
      <textarea
        className="notepad-textarea"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Write your notes here..."
      />
    </div>
  )
}