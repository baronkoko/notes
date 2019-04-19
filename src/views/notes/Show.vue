<template>
  <div class="notes">
    <div class="container">
      <div class="row">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-white">
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'home' }">Home</router-link>
            </li>
            <li
              class="breadcrumb-item active"
              aria-current="page"
            >
              View note
            </li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="mb-4">View note</h1>
        </div>
      </div>
    </div>
    <div
      class="container"
      v-if="isLoading"
    >
      <div class="row">
        <div class="col">
          <div class="text-center my-5">
            <div
                    class="spinner-border"
                    role="status"
            >
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="container"
      v-else
    >
      <div class="row">
        <div class="col-lg-8 mb-5">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-start justify-content-between">
                <h2 class="card-title h4 pr-2">{{ note.name }}</h2>
                <div
                  class="btn-group"
                  role="group"
                  aria-label="Note toolbar"
                >
                  <router-link
                    :to="{ name: 'edit', params: { id: noteId } }"
                    class="btn text-primary"
                  >
                    <font-awesome-icon icon="pen" />
                  </router-link>
                  <a
                    href="#"
                    role="button"
                    class="btn text-danger"
                    @click.prevent="confirmNoteDeleting"
                    title="Delete note"
                  >
                    <font-awesome-icon icon="trash" />
                  </a>
                </div>
              </div>
              <p class="card-text">{{ note.content }}</p>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <note-comments :noteId="noteId.toString()"></note-comments>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoteComments from '@/components/NoteComments'
import DbService from '@/services/DbService'

export default {
  name: 'Note',
  metaInfo: {
    title: 'View note'
  },
  components: {
    NoteComments
  },
  data: () => ({
    note: '',
    isLoading: true
  }),
  computed: {
    appDatabase () {
      return window.localStorage.getItem('app-database')
    },
    noteId () {
      return this.$route.params.id
    }
  },
  mounted () {
    this.getNote()
  },
  methods: {
    getNote () {
      (this.appDatabase !== 'local') ? this.getNoteFromDb() : this.getNoteFromLocalStorage()
    },
    getNoteFromDb () {
      DbService.getOneNote(this.noteId).then((note) => {
        note.data() ? this.getNoteSuccess(note.data()) : this.noteNotFound()
      }).catch((error) => {
        this.$toasted.error(`Error getting note: ${error}`)
      })
    },
    getNoteFromLocalStorage () {
      const notes = JSON.parse(window.localStorage.getItem('notes')) || []
      const note = notes.find(note => note.id === parseInt(this.noteId))
      note ? this.getNoteSuccess(note) : this.noteNotFound()
    },
    getNoteSuccess (data) {
      this.note = data
      this.isLoading = false
    },
    noteNotFound () {
      this.$router.push({ name: '404' })
    },
    confirmNoteDeleting () {
      this.$toasted.error(`Delete note?`, {
        position: 'bottom-center',
        duration: null,
        action: [
          {
            text: 'No',
            onClick: (e, toastObject) => {
              toastObject.goAway(0)
            }
          },
          {
            text: 'Yes',
            onClick: (e, toastObject) => {
              toastObject.goAway(0)
              this.$Progress.start();
              (this.appDatabase !== 'local') ? this.deleteNoteFromDb() : this.deleteNoteFromLocalStorage()
            }
          }
        ]
      })
    },
    deleteNoteFromDb () {
      DbService.deleteNote(this.noteId).then(() => {
        this.deleteNoteCommentsFromDb()
      }).catch((error) => {
        this.$toasted.error(`Error deleting note: ${error}`)
        this.$Progress.finish()
      })
    },
    deleteNoteCommentsFromDb () {
      DbService.deleteNoteComments(this.noteId).then(() => {
        this.noteDeletingSuccess()
      }).catch((error) => {
        this.$toasted.error(`Error deleting note comments: ${error}`)
        this.$Progress.finish()
      })
    },
    deleteNoteFromLocalStorage () {
      let notes = JSON.parse(window.localStorage.getItem('notes')) || []
      const noteIndex = notes.findIndex(note => note.id === parseInt(this.noteId))
      if (noteIndex !== undefined) {
        notes.splice(noteIndex, 1)
        window.localStorage.setItem('notes', JSON.stringify(notes))
        this.deleteNoteCommentsFromLocalStorage()
      } else {
        this.$toasted.error('Error deleting this note. Please try again')
        this.$Progress.finish()
      }
    },
    deleteNoteCommentsFromLocalStorage () {
      const comments = JSON.parse(window.localStorage.getItem('comments')) || []
      const noteComments = comments.filter(comment => comment.note_id !== this.noteId.toString())
      window.localStorage.setItem('comments', JSON.stringify(noteComments))
      this.noteDeletingSuccess()
    },
    noteDeletingSuccess () {
      this.$toasted.success(`Note deleted`)
      this.$router.push({ name: 'home' })
      this.$Progress.finish()
    }
  }
}
</script>
