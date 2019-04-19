import { db } from './DbConfig'

export default {
  getAllNotes () {
    return db.collection('notes')
  },
  getOneNote (id) {
    return db.collection('notes').doc(id).get()
  },
  setNote (data) {
    return db.collection('notes').add(data)
  },
  updateNote (id, data) {
    return db.collection('notes').doc(id).update(data)
  },
  deleteNote (id) {
    return db.collection('notes').doc(id).delete()
  },
  getNoteComments (noteId) {
    return db.collection('comments').where('note_id', '==', noteId)
  },
  addNoteComment (data) {
    return db.collection('comments').add(data)
  },
  deleteNoteComments (noteId) {
    return db.collection('comments').where('note_id', '==', noteId).get().then((querySnapshot) => {
      querySnapshot.docs.length && querySnapshot.forEach((snapshot) => {
        snapshot.ref.delete()
      })
    })
  }
}
