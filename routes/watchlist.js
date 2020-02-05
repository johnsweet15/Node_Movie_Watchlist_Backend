const express = require('express')
const router = express.Router()
const Watchlist = require('../models/Watchlist')
const verify = require('./verifyToken')

// gets all watchlists
router.get('/', verify, async (req, res) => {
  try {
    const watchlists = await Watchlist.find()
    res.json(watchlists)
  } catch (error) {
    res.json({ message: error })
  }
})

// submit watchlist
router.post('/', async (req, res) => {
  const watchlist = new Watchlist({
    title: req.body.title,
    description: req.body.description
  })

  try {
    const savedWatchlist = await watchlist.save();
    res.status(200).json(savedWatchlist)
  } catch (error) {
    res.json({ message: error })
  }

})

// get specific watchlist
router.get('/:watchlistId', async (req, res) => {
  try {
    const watchlist = await Watchlist.findById(req.params.watchlistId)
    res.json(watchlist)
  } catch (error) {
    res.json({ message: error })
  }
})

// delete specific watchlist
router.delete('/:watchlistId', async (req, res) => {
  try {
    const removedWatchlist = await Watchlist.remove({ _id: req.params.watchlistId })
    res.json(removedWatchlist)
  } catch (error) {
    res.json({ message: error })
  }
})

// update a watchlist
router.patch('/:watchlistId', async (req, res) => {
  try {
    const updatedWatchlist = await Watchlist.updateOne({
      _id: req.params.watchlistId
    },
      {
        $set: { title: req.body.title }
      })
    res.json(updatedWatchlist)
  } catch (error) {
    res.json({ message: error })
  }
})

module.exports = router