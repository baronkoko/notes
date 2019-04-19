<template>
  <div class="edit">
    <div class="container">
      <div class="row">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-white">
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'home' }">Home</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'show', params: { id: noteId } }">View note</router-link>
            </li>
            <li
              class="breadcrumb-item active"
              aria-current="page"
            >
              Edit note
            </li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="mb-4">Edit note</h1>
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
        <div class="col">
          <form @submit.prevent="validateForm">
            <div class="form-group">
              <label for="note-name">Note name</label>
              <input
                id="note-name"
                v-model="form.name"
                v-validate="'required'"
                type="text"
                name="name"
                class="form-control"
                :class="{'is-invalid': errors.has('name') }"
                placeholder="Enter note name"
              >
              <div
                class="alert alert-danger mt-2"
                role="alert"
                v-show="errors.has('name')"
              >
                {{ errors.first('name') }}
              </div>
            </div>
            <div class="form-group">
              <label for="note-content">Note content</label>
              <textarea
                id="note-content"
                v-model="form.content"
                v-validate="'required'"
                name="content"
                class="form-control"
                :class="{'is-invalid': errors.has('content') }"
                rows="3"
              ></textarea>
              <div
                class="alert alert-danger mt-2"
                role="alert"
                v-show="errors.has('content')"
              >
                {{ errors.first('content') }}
              </div>
            </div>
            <button
              type="submit"
              class="btn btn-primary"
            >Update</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DbService from '@/services/DbService'

export default {
  name: 'Create',
  metaInfo: {
    title: 'Edit note'
  },
  data: () => ({
    form: {
      name: '',
      content: ''
    },
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
      if (this.appDatabase !== 'local') {
        DbService.getOneNote(this.noteId).then((note) => {
          note.data() ? this.fillForm(note.data()) : this.noteNotFound()
        }).catch((error) => {
          this.$toasted.error(`Error getting note: ${error}`)
        })
      } else {
        const notes = JSON.parse(window.localStorage.getItem('notes')) || []
        const note = notes.find(note => note.id === parseInt(this.noteId))
        note ? this.fillForm(note) : this.noteNotFound()
      }
    },
    noteNotFound () {
      this.$router.push({ name: 'pageNotFound' })
    },
    fillForm (data) {
      this.form = {
        name: data.name,
        content: data.content
      }
      this.isLoading = false
    },
    validateForm () {
      const self = this
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.$Progress.start()
          self.submitForm()
        }
      })
    },
    submitForm () {
      if (this.appDatabase !== 'local') {
        DbService.updateNote(this.noteId, this.form).then(() => {
          this.$toasted.success(`Note updated`, {
            action: {
              text: 'View note',
              onClick: (e, toastObject) => {
                this.$router.push({ name: 'show', params: { id: this.noteId.toString() } })
                toastObject.goAway(0)
              }
            }
          })
        }).catch((error) => {
          this.$toasted.error(`Error updating document: ${error}`)
        })
      } else {
        const notes = JSON.parse(window.localStorage.getItem('notes')) || []
        const noteIndex = notes.findIndex(note => note.id === parseInt(this.noteId))
        notes[noteIndex] = {
          id: parseInt(this.noteId),
          ...this.form
        }
        window.localStorage.setItem('notes', JSON.stringify(notes))
        this.$toasted.success(`Note updated`, {
          action: {
            text: 'View note',
            onClick: (e, toastObject) => {
              this.$router.push({ name: 'show', params: { id: this.noteId.toString() } })
              toastObject.goAway(0)
            }
          }
        })
      }
      this.$Progress.finish()
    }
  }
}
</script>
