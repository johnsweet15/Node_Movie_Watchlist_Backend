const mongoose = require('mongoose')

const WatchlistSchema = mongoose.Schema({
  movies: {
    type: Array,
    default: []
  },
  tvShows: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model('Watchlist', WatchlistSchema)