const mongoose = require('mongoose')
const { connection, Schema } = mongoose
mongoose.connect(
  'mongodb://localhost:27017/test'
).catch(console.error)

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
})
// Init
UserSchema.pre('init', async function preInit() {
  console.log('A document is going to be initialized.')
})
UserSchema.post('init', async function postInit() {
  console.log('A document was intialized.')
})
// Validate
UserSchema.pre('validate', async function preValidate() {
  console.log('A document is going to be validated.')
})
UserSchema.post('validate', async function postValidate() {
  console.log('All validation rules were executed')
})
// Save
UserSchema.pre('save', async function preSave() {
  console.log('Preparing to save the document')
})
UserSchema.post('save', async function postRemove() {
  console.log(`A doc was saved id=${this.id}`)
})
// Remove
UserSchema.pre('remove', async function preRemove() {
  console.log('Preparing to save the document')
})
UserSchema.post('remove', async function postRemove() {
  console.log(`A doc was saved id=${this.id}`)
})

const User = mongoose.model('User', UserSchema)

connection.once('connected', async () => {
  try {
    const user = new User({
      firstName: 'John',
      lastName: 'Smith'
    })
    await user.save()
    await User.findById(user.id)
    await user.remove()
    await connection.close()
  } catch (error) {
    await connection.close()
    console.dir(error.message, { colors: true })
  }
})

