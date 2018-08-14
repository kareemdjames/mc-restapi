const mongoose = require('mongoose')
const { connection, Schema } = mongoose
mongoose.connect(
  'mongodb://localhost:27017/test'
).catch(console.error)

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  likes: [String]
})
// Document instance method for setting user's first and last name from string contaning full name 
UserSchema.method('setFullName', function setFullName(v) {
  const fullName = String(v).split(' ')
  this.lastName = fullName[0] || ''
  this.firstName = fullName[1] || ''
})
// Document instance method for getting user's full name 
UserSchema.method('getFullName', function getFullName() {
  return `${this.lastName} ${this.firstName}`
})
// Document instance method that will expect one argument that will add to the likes array
UserSchema.method('loves', function loves(stuff) {
  this.likes.push(stuff)
})
// Document instance method which will remove one thing previously liked by the user in the likes array
UserSchema.method('dislikes', function dislikes(stuff) {
  this.likes = this.likes.filter(str => str !== stuff)
})

const User = mongoose.model('User', UserSchema)

connection.once('connected', async () => {
  try {
    // Create
    const user = new User()
    user.setFullName('Huang Jingxuan')
    user.loves('kitties')
    user.loves('strawberries')
    user.loves('dogs')
    await user.save()
    // Update
    const person = await User.findOne()
      .where('firstName', 'Jingxuan')
      .where('likes').in(['dogs', 'kitties'])
    person.dislikes('dogs')
    await person.save()
    // Display
    console.log(person.getFullName())
    console.log(JSON.stringify(person, null, 4))
    // Remove
    await user.remove()
  } catch(error) {
    console.dir(error.message, { colors: true })
  } finally {
    await connection.close()
  }
})
