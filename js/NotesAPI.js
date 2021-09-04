import { getRandomId } from "./RandomID.js"

export default class NotesAPI {
  static getAllNotes() {
    const notes = JSON.parse(
      localStorage.getItem("notett-notes") ||
        JSON.stringify([
          {
            id: getRandomId(),
            title: "New Note",
            body: "Start writing...",
            updated_at: new Date().toISOString()
          },
        ])
    )

    return notes.sort((a, b) => {
      return new Date(a.updated_at) > new Date(b.updated_at) ? -1 : 1
    })
  }

  static saveNote(note) {
    const notes = NotesAPI.getAllNotes()
    const existingNote = notes.find((n) => n.id == note.id)

    if (existingNote) {
      existingNote.title = note.title
      existingNote.body = note.body
      existingNote.updated_at = new Date()
    } else {
      note.id = getRandomId()
      note.updated_at = new Date().toISOString()
      notes.push(note)
    }

    localStorage.setItem("notett-notes", JSON.stringify(notes))
  }

  static deleteNote(id) {
    const notes = NotesAPI.getAllNotes()

    const editedNotes = notes.filter((note) => note.id != id)

    localStorage.setItem("notett-notes", JSON.stringify(editedNotes))
  }

  static deleteAllNotes() {
    localStorage.setItem("notett-notes", JSON.stringify("[]"))
  }
}
