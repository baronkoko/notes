<template>
  <div class="note-comments">
    <p class="text-dark font-weight-bold text-center">Comments</p>
    <div
      class="text-center my-5"
      v-if="isLoading"
    >
      <div
        class="spinner-border"
        role="status"
      >
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <div
      class="note-comments-list"
      v-else
    >
      <div
        class="list-group"
        v-if="comments.length"
      >
        <div
          class="list-group-item"
          v-for="comment in sortedComments"
          :key="comment.id"
        >
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">{{ comment.author }}</h5>
            <small>{{ comment.created_at | formatDate }}</small>
          </div>
          <p class="mb-0">{{ comment.content }}</p>
        </div>
      </div>
      <div
        class="mb-5"
        v-else
      >
        <div class="card">
          <div class="card-body text-center">
            <p class="mb-0">No comments yet</p>
          </div>
        </div>
      </div>
    </div>
    <div class="note-comments-form mt-5">
      <p class="text-dark font-weight-bold text-center">Add new comment</p>
      <form @submit.prevent="validateForm">
        <div class="form-group">
          <label for="comment-author">Your name</label>
          <input
            id="comment-author"
            v-model="form.author"
            v-validate="{
              required: true,
              regex: /^([A-Z]{1}[a-z]+) ([A-Z]{1}[a-z]+)$/
            }"
            type="text"
            name="name"
            class="form-control"
            :class="{'is-invalid': errors.has('author') }"
            data-vv-as="name"
            aria-describedby="nameHelp"
            placeholder="Enter your name"
          >
          <small id="nameHelp" class="form-text text-muted">This field must contain first name and last name, both with a capital letter.</small>
          <div
            class="alert alert-danger mt-2"
            role="alert"
            v-show="errors.has('author')"
          >
            {{ errors.first('author') }}
          </div>
        </div>
        <div class="form-group">
          <label for="comment-content">Your comment</label>
          <textarea
            id="comment-content"
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
        >Add comment</button>
      </form>
    </div>
  </div>
</template>

<script>
import DbService from '@/services/DbService'

export default {
  name: 'NoteComments',
  props: {
    noteId: String
  },
  filters: {
    formatDate: function (value) {
      if (!value) return ''
      const date = new Date(value)
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    }
  },
  data: () => ({
    comments: [],
    form: {
      author: '',
      content: ''
    },
    unsubscribeCommentsChanges: '',
    isLoading: true
  }),
  computed: {
    appDatabase () {
      return window.localStorage.getItem('app-database')
    },
    sortedComments () {
      const comments = this.comments
      return comments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    }
  },
  mounted () {
    this.getNoteComments()
  },
  beforeDestroy () {
    this.unsubscribeCommentsChanges && this.unsubscribeCommentsChanges()
  },
  methods: {
    getNoteComments () {
      (this.appDatabase !== 'local') ? this.getNoteCommentsFromDb() : this.getNoteCommentsFromLocalStorage()
    },
    getNoteCommentsFromDb () {
      this.unsubscribeCommentsChanges = DbService.getNoteComments(this.noteId).onSnapshot((querySnapshot) => {
        this.comments = []
        const noDate = ({ created_at, ...rest }) => rest /* eslint-disable-line */
        querySnapshot.docs.length && querySnapshot.forEach((doc) => {
          const date = doc.data().created_at.toDate()
          this.comments.push({ id: doc.id, created_at: date, ...noDate(doc.data()) })
        })
        this.isLoading = false
      }, (error) => {
        this.$toasted.error(`Error getting note: ${error}`)
      })
    },
    getNoteCommentsFromLocalStorage () {
      this.comments = []
      const comments = JSON.parse(window.localStorage.getItem('comments')) || []
      this.comments = comments.filter((comment) => comment.note_id === this.noteId)
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
        DbService.addNoteComment({ note_id: this.noteId, created_at: new Date(), ...this.form }).then(() => {
          this.getNoteComments()
        }).catch((error) => {
          this.$toasted.error(`Error adding comment: ${error}`)
        })
      } else {
        const comments = JSON.parse(window.localStorage.getItem('comments')) || []
        const comment = {
          note_id: this.noteId,
          created_at: new Date(),
          ...this.form
        }
        comments.push(comment)
        window.localStorage.setItem('comments', JSON.stringify(comments))
        this.getNoteComments()
      }
      this.$Progress.finish()
      this.resetForm()
    },
    resetForm () {
      this.form = {
        author: '',
        content: ''
      }
      this.$validator.reset()
    }
  }
}
</script>
