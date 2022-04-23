import { getRandomId } from "./RandomID.js"

export default class NotesAPI {
  /**
   *
   * @returns {object[]} Returns all notes in LocalStorage
   */
  static getAllNotes() {
    const notes = JSON.parse(
      localStorage.getItem("notett-notes") ||
        JSON.stringify([
          {
            id: getRandomId(),
            title: "New Note",
            body: "Start writing...",
            updated_at: new Date().toISOString(),
          },
        ])
    )

    return notes.sort((a, b) => {
      return new Date(a.updated_at) > new Date(b.updated_at) ? -1 : 1
    })
  }

  /**
   *
   * @param {object} note
   * @description  Add a note to LocalStorage or update an existing one
   */
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

  /**
   *
   * @param {string} id
   * @description Deletes a note in LocalStorage
   */
  static deleteNote(id) {
    const notes = NotesAPI.getAllNotes()

    const editedNotes = notes.filter((note) => note.id != id)

    localStorage.setItem("notett-notes", JSON.stringify(editedNotes))
  }

  /**
   * @description Deletes all notes in LocalStorage
   */
  static deleteAllNotes() {
    localStorage.setItem(
      "notett-notes",
      JSON.stringify([
        {
          id: getRandomId(),
          title: "New Note",
          body: "Start writing...",
          updated_at: new Date().toISOString(),
        },
      ])
    )
  }

  /**
   * 
   * @param {object[]} backupData 
   * @description Restore Backup File
   */
  static restoreBackup(backupData) {
    localStorage.setItem('notett-notes', JSON.stringify(backupData))
  }
}
