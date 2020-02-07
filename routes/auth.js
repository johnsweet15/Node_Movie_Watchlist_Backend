const router = require('express').Router()
const User = require('../models/User')
const Watchlist = require('../models/Watchlist')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { registerValidation, loginValidation } = require('../validation')

/*
  REGISTER USER
*/
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
    res.status(400).send({ message: err })
  }
})

/*
  LOGIN USER
*/
router.post('/login', async (req, res) => {

  // Validate data
  const { error } = loginValidation(req.body)
  if (error) {
    return res.status(400).send({ success: false, message: error.details[0].message })
  }

  // Check if user is already in database
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(403).send({ success: false, message: 'Email or password incorrect' })
  }

  // Check if password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) {
    return res.status(403).send({ success: false, message: 'Password incorrect' })
  }

  // Create and assign token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  res.header('auth-token', token).send({ success: true, token: token, _id: user._id })

})

/*
  GET USER PROFILE
*/
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.userId
    })
    res.status(200).send({
      profile: {
        name: user.name,
        email: user.email,
        date: user.date
      }
    })
  } catch (error) {
    res.status(400).send({ message: error })
  }
})

module.exports = router