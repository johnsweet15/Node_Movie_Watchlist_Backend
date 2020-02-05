const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { registerValidation, loginValidation } = require('../validation')


router.post('/register', async (req, res) => {

  // Validate data
  const { error } = registerValidation(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // Check if user is already in database
  const emailExists = await User.findOne({ email: req.body.email })
  if (emailExists) {
    return res.status(400).send({ message: 'Email already exists' })
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  })

  // Save user to DB
  try {
    const savedUser = await user.save()
    res.send({ user: user._id })
  } catch (err) {
    res.status(400).send(err)
  }
})

// Login
router.post('/login', async(req, res) => {

  // Validate data
  const { error } = loginValidation(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  // Check if user is already in database
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(400).send({ message: 'Email or password incorrect' })
  }

  // Check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if(!validPassword) {
    return res.status(400).send('Password incorrect')
  }

  // Create and assign token
  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
  res.header('auth-token', token).send(token)

})

module.exports = router