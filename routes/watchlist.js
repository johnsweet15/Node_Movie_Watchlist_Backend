const express = require('express')
const router = express.Router()
const Watchlist = require('../models/Watchlist')
const User = require('../models/User')
const verify = require('./verifyToken')

// Get watchlist
router.get('/:userId', verify, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.userId
    })
    res.json(user.watchlist)
  } catch (error) {
    res.json({ message: error })
  }
})

// Add movie to watchlist
router.patch('/:userId', verify, async (req, res) => {
  try {
    const updatedWatchlist = await User.updateOne({
      _id: req.params.userId
    },
      {
        $push: { watchlist: req.body }
      })
    res.json(updatedWatchlist)
  } catch (error) {
    res.json({ message: error })
  }
})

// Delete movie from watchlist
router.delete('/:userId', verify, async (req, res) => {
  try {
    const updatedWatchlist = await User.updateOne({
      _id: req.params.userId
    },
      {
        $pull: { watchlist: req.body }
      })
    res.json(updatedWatchlist)
  } catch (error) {
    res.json({ message: error })
  }
})


module.exports = router