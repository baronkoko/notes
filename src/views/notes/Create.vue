<template>
  <div class="create">
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
              Create note
            </li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="mb-4">Create note</h1>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col">
          <form
            @submit.prevent="validateForm"
            autocomplete="off"
          >
            <div class="form-group">
              <label for="note-name">Note name</label>
              <input
                id="note-name"
                v-model="form.name"
                v-validate="'required'"
                type="text"
                name="title"
                class="form-control"
                :class="{'is-invalid': errors.has('name') }"
                placeholder="Enter note name"
                autocomplete="nope"
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
            >Create</button>
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
    title: 'Create note'
  },
  data: () => ({
    form: {
      name: '',
      content: ''
    }
  }),
  computed: {
    appDatabase () {
      return window.localStorage.getItem('app-database')
    }
  },
  methods: {
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
        DbService.setNote(this.form).then((note) => {
          this.$router.push({ name: 'show', params: { id: note.id.toString() } })
        }).catch((error) => {
          this.$toasted.error(`Error setting note: ${error}`)
        })
      } else {
        const notes = JSON.parse(window.localStorage.getItem('notes')) || []
        const note = {
          id: (notes.length) ? notes[notes.length - 1].id + 1 : 1,
          ...this.form
        }
        notes.push(note)
        window.localStorage.setItem('notes', JSON.stringify(notes))
        this.$router.push({ name: 'show', params: { id: note.id.toString() } })
      }
      this.$Progress.finish()
      this.resetForm()
      this.$toasted.success(`Note created`)
    },
    resetForm () {
      this.form = {
        name: '',
        content: ''
      }
      this.$validator.reset()
    }
  }
}
</script>
