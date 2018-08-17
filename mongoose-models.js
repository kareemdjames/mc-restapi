const mongoose = require('mongoose')
const { connection, Schema } = mongoose

// Connect to Mongo
mongoose.connect(
  'mongodb://localhost:27017/test'
).catch(console.error)

// Define Schema
const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  likes: [String]
})

// Compile schema into model
const User = mongoose.model('User', UserSchema)

// Add new users
const addUser = (firstName, lastName) => new User({
  firstName,
  lastName
}).save()

// Get user
const getUser = (id) => User.findById(id)

// Remove user
const removeUser = (id) => User.remove({ id })

// CRUD operations
connection.once('connected', async () => {
  try {
    //Create
    const newUser = await addUser('John', 'Smith')
    // Read
    const user = await getUser(newUser.id)
    // Update
    user.firstName = 'Jonny'
    user.lastName = 'Smithy'
    user.likes = [
      'cooking',
      'watching movies',
      'ice cream'
    ]
    await user.save()
    console.log(JSON.stringify(user, null, 4))
    // Delete
    await removeUser(user.id)
  
  } catch (error) {
    console.dir(error.message, { colors: true })
  } finally {
    await connection.close
  }
})

