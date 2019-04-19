<template>
  <div class="notes">
    <div class="container">
      <div class="row">
        <div class="col">
          <h1 class="mb-4">All Notes</h1>
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
      <div
        class="row"
        v-if="notes.length"
      >
        <div class="col">
          <div class="card-columns">
            <router-link
              v-for="note in notes"
              :key="note.id"
              :to="{ name: 'show', params: { id: note.id } }"
              class="card text-dark bg-white text-decoration-none shadow-sm rounded"
            >
              <div class="card-body">
                <h5 class="card-title font-weight-bold">{{ note.name }}</h5>
                <p class="card-text">W{{ note.content }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div
        class="row"
        v-else
      >
        <div class="col">
          <div
            class="text-center my-5"
            role="alert"
          >
            <p>Notes list is empty. Press "Create Note" to get one.</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <router-link
            :to="{ name: 'create' }"
            class="btn btn-primary btn-lg btn-block mt-4"
          >Create Note</router-link>
        </div>
      </div>
  </div>
  </div>
</template>

<script>
import DbService from '@/services/DbService'

export default {
  name: 'Notes',
  metaInfo: {
    title: 'All notes'
  },
  data: () => ({
    notes: [],
    unsubscribeNotesChanges: '',
    isLoading: true
  }),
  computed: {
    appDatabase () {
      return window.localStorage.getItem('app-database')
    }
  },
  mounted () {
    this.getNotes()
  },
  beforeDestroy () {
    this.unsubscribeNotesChanges && this.unsubscribeNotesChanges()
  },
  methods: {
    getNotes () {
      (this.appDatabase !== 'local') ? this.getNotesFromDb() : this.getNotesFromLocalStorage()
    },
    getNotesFromDb () {
      this.unsubscribeNotesChanges = DbService.getAllNotes().onSnapshot((querySnapshot) => {
        this.notes = []
        querySnapshot.docs.length && querySnapshot.forEach((doc) => {
          this.notes.push({ id: doc.id, ...doc.data() })
        })
        this.isLoading = false
      }, (error) => {
        this.$toasted.error(`Error getting notes: ${error}`)
      })
    },
    getNotesFromLocalStorage () {
      this.notes = (window.localStorage.getItem('notes')) ? JSON.parse(window.localStorage.getItem('notes')) : []
      this.isLoading = false
    }
  }
}
</script>
