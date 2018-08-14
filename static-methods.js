const mongoose = require('mongoose')
const { connection, Schema } = mongoose
mongoose.connect(
  'mongodb://localhost:27017/test'
).catch(console.error)

const UsrSchm = new Schema({
  firstName: String,
  lastName: String,
  likes: [String]
})

UsrSchm.static('getByFullName', function getByFullName(v) {
  const fullName = String(v).split(' ')
  const lastName = fullName[0] || ''
  const firstName = fullName[1] || ''
  return this.findOne()
    .where('firstName').equals(firstName)
    .where('lastName').equals(lastName)
})

const User = mongoose.model('User', UsrSchm)

connection.once('connected', async () => {
  try {
    const user = new User({
      firstName: 'Jingxuan',
      lastName: 'Huang', 
      likes: ['kitties', 'strawberries'] 
    })
    await user.save()
    // Read
    const person = await User.getByFullName(
      'Huang Jingxuan'
    )
    console.log(JSON.stringify(person, null, 4))
    await person.remove()
    await connection.close()
  } catch(error) {
    console.log(error.message)
  }
})