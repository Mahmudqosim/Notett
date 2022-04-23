export default class NotesView {
  constructor(
    root,
    {
      onNoteSelect,
      onNoteAdd,
      onNoteEdit,
      onNoteDelete,
      onNotesDeleteAll,
      onNotesRestore,
      onNotesBackup,
    } = {}
  ) {
    this.root = root
    this.onNoteSelect = onNoteSelect
    this.onNoteAdd = onNoteAdd
    this.onNoteEdit = onNoteEdit
    this.onNoteDelete = onNoteDelete
    this.onNotesDeleteAll = onNotesDeleteAll

    this.root.innerHTML = `
        <div class="toast__container" role="alert" aria-hidden="true">
          <div class="toast__content">
            <p>Are you sure you want to delete this note?</p>
            <div class="toast__buttons">
              <button class="toast__yes">Yes</button>
              <button class="toast__no">No</button>
            </div>
            <button class="close-toast">Close</button>
          </div>
        </div>
        <div class="modal__container" role="alert" aria-hidden="true">
        
        <div class="modal__content">
            <span class="close-modal">&times;</span>
            <div class="modal__buttons">
              <input style="display: none;" type="file" id="fileHandler" />
              <button class="backup-data">Backup Data</button>
              <label class="restore-data" for="fileHandler">Restore Data</label>
              <button class="red delete-all">Delete Notes</button>
            </div>
            <div class="social">
              <a href="https://github.com/mahmudqosim" target="_blank">
                <img src="./icons/github.svg" />
              </a>
            </div>
          </div>
        </div>
        <div class="notes__sidebar">
          <span class="close-sidebar">&times;</span>
          <!-- <input class="notes__search" type="search" placeholder="Search notes" title="Search notes" /> -->
          <button title="Add Note" class="notes__add" type="button">Add Note</button>
          <div class="notes__list"></div>
        </div>
        <div class="menu">
          <img class="menu__btn" src="./icons/menu.svg" title="Open menu" />
        </div>
        <div class="notes__preview">
            <button title="Save note (Doesn't really do anything.)" class="save-btn"><img src="./icons/save.svg" /></button>
            <input type="text" class="notes__title" placeholder="New Note...">
            <textarea class="notes__body">Start writing...</textarea>
        </div>
        <div class="info">
            <span>
              <img src="./icons/cog.svg" />
            <span>
        </div>
        `

    this.toastContainer = this.root.querySelector(".toast__container")

    const addNoteBtn = this.root.querySelector(".notes__add")
    const titleInputEl = this.root.querySelector(".notes__title")
    const bodyInputEl = this.root.querySelector(".notes__body")
    const closeToastBtn = this.root.querySelector(".close-toast")
    const toastYes = this.root.querySelector(".toast__yes")
    const toastNo = this.root.querySelector(".toast__no")
    const infoBtn = this.root.querySelector(".info")
    const modalContainer = this.root.querySelector(".modal__container")
    const modalContent = this.root.querySelector(".modal__content")
    const closeModalBtn = this.root.querySelector(".close-modal")
    const notesSidebar = this.root.querySelector(".notes__sidebar")
    const menuBtn = this.root.querySelector(".menu__btn")
    const closeSidebarBtn = this.root.querySelector(".close-sidebar")
    const saveBtn = this.root.querySelector(".save-btn")
    const deleteAllBtn = this.root.querySelector(".delete-all")
    const fileHandler = this.root.querySelector("#fileHandler")
    const downloadDataBtn = this.root.querySelector(".backup-data")

    menuBtn.addEventListener("click", () => {
      notesSidebar.classList.add("active")
    })

    closeSidebarBtn.addEventListener("click", () => {
      notesSidebar.classList.remove("active")
    })

    infoBtn.addEventListener("click", () => {
      modalContainer.classList.add("active")
      modalContent.classList.add("active")
    })

    closeModalBtn.addEventListener("click", () => {
      modalContainer.classList.remove("active")
      modalContent.classList.remove("active")
    })

    closeToastBtn.addEventListener("click", () => {
      this.toastContainer.setAttribute("aria-hidden", true)
      this.toastContainer.removeAttribute("data-node-id")
    })

    toastNo.addEventListener("click", () => {
      this.toastContainer.setAttribute("aria-hidden", true)
      this.toastContainer.removeAttribute("data-node-id")
    })

    toastYes.addEventListener("click", () => {
      this.onNoteDelete(this.toastContainer.dataset.nodeId)
      this.toastContainer.setAttribute("aria-hidden", true)
      this.toastContainer.removeAttribute("data-node-id")
    })

    addNoteBtn.addEventListener("click", () => {
      this.onNoteAdd()
    })

    let editEl = [titleInputEl, bodyInputEl]

    editEl.forEach((el) => {
      el.addEventListener("blur", () => {
        const updatedTitle = titleInputEl.value.trim()
        const updatedBody = bodyInputEl.value.trim()

        this.onNoteEdit(updatedTitle, updatedBody)
      })
    })

    saveBtn.addEventListener("click", () => {
      const updatedTitle = titleInputEl.value.trim()
      const updatedBody = bodyInputEl.value.trim()

      this.onNoteEdit(updatedTitle, updatedBody)
    })

    deleteAllBtn.addEventListener("click", () => {
      this.onNotesDeleteAll()

      modalContainer.classList.remove("active")
      modalContent.classList.remove("active")
    })

    fileHandler.addEventListener("change", () => {
      onNotesRestore(fileHandler.files[0], () => {
        modalContainer.classList.remove("active")
        modalContent.classList.remove("active")
      })
    })

    downloadDataBtn.addEventListener("click", () => {
      onNotesBackup()
    })

    this.updateNotePreviewVisibility(false)
  }

  _createListItemHTML(id, title, body, updated_at) {
    const MAX_BODY_LENGTH = 60

    return `
        <div class="notes__list-item" data-note-id="${id}">
            <div class="notes__small-title">${title}</div>
            <div class="notes__small-body">
               ${body.substring(0, MAX_BODY_LENGTH)}${
      body.length > MAX_BODY_LENGTH ? "..." : ""
    }
            </div>
            <div class="notes__small-updated">
            <img title="Delete Note: ${title}" class="delete-icon" src="./icons/trash.svg" data-note-id="${id}" />
            ${updated_at.toLocaleString(undefined, {
              dateStyle: "full",
              timeStyle: "short",
            })}</div>
        </div>
      `
  }

  updateNotesList(notes) {
    const notesListContainer = this.root.querySelector(".notes__list")

    notesListContainer.innerHTML = ""

    for (const note of notes) {
      const html = this._createListItemHTML(
        note.id,
        note.title,
        note.body,
        new Date(note.updated_at)
      )

      notesListContainer.insertAdjacentHTML("beforeend", html)
    }

    notesListContainer
      .querySelectorAll(".notes__list-item")
      .forEach((noteListItem) => {
        noteListItem.addEventListener("click", () => {
          this.onNoteSelect(noteListItem.dataset.noteId)
        })
      })

    const deleteIcons = Array.from(this.root.querySelectorAll(".delete-icon"))

    deleteIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        this.toastContainer.setAttribute("aria-hidden", false)
        this.toastContainer.setAttribute("data-node-id", icon.dataset.noteId)
      })
    })
  }

  updateActiveNote(note) {
    this.root.querySelector(".notes__title").value = note.title
    this.root.querySelector(".notes__body").value = note.body

    this.root.querySelectorAll(".notes__list-item").forEach((noteListItem) => {
      noteListItem.classList.remove("notes__list-item--selected")
    })

    this.root
      .querySelector(`.notes__list-item[data-note-id='${note.id}']`)
      .classList.add("notes__list-item--selected")
  }

  updateNotePreviewVisibility(visible) {
    this.root.querySelector(".notes__preview").style.visibility = visible
      ? "visible"
      : "hidden"
  }
}
