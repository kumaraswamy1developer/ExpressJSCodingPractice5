const express = require('express')

const path = require('path')

const dbPath = path.join(__dirname, 'moviesData.db')

const {open} = require('sqlite')

const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

module.exports = app

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({filename: dbPath, driver: sqlite3.Database})
    app.listen(3000, () => {
      console.log('Server Running at htt://3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

//GET Movies List API1
app.get('/movies/', async (request, response) => {
  const getMoviesQuery = `SELECT * FROM movie;`
  const moviesList = await db.all(getMoviesQuery)
  const moviesArray = movieList => {
    return {
      movieName: movieList.movie_name,
    }
  }
  response.send(moviesList.map(eachMovie => moviesArray(eachMovie)))
})

//POST Movie API2
app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addMovieQuery = `INSERT INTO movie(director_id, movie_name, lead_actor) VALUES(${directorId},'${movieName}','${leadActor}');`
  const movie = await db.run(addMovieQuery)
  response.send('Movie Successfully Added')
})

//GET movie API3
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovieQuery = `SELECT * FROM movie WHERE movie_id=${movieId};`
  const movie = await db.get(getMovieQuery)
  const {movie_id, director_id, movie_name, lead_actor} = movie
  response.send({
    movieId: movie_id,
    directorId: director_id,
    movieName: movie_name,
    leadActor: lead_actor,
  })
})

//Update Movie API4
app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const updatedMovieQuery = `UPDATE movie SET  director_id=${directorId},movie_name='${movieName}',lead_Actor='${leadActor}';`
  await db.run(updatedMovieQuery)
  response.send('Movie Details Updated')
})

//Delete Movie API5
app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteMovieQuery = `DELETE FROM movie WHERE movie_id=${movieId};`
  await db.run(deleteMovieQuery)
  response.send('Movie Removed')
})

//GET Directors API6
app.get('/directors/', async (request, response) => {
  const getDirectorsQuery = `SELECT * FROM director;`
  const directors = await db.all(getDirectorsQuery)
  const directorsArray = director => {
    return {
      directorId: director.director_id,
      directorName: director.director_name,
    }
  }
  response.send(directors.map(eachDirector => directorsArray(eachDirector)))
})

//GET Director Movies API 7
app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getDirectorMoviesQuery = `SELECT * FROM movie WHERE director_id=${directorId};`
  const directorMoviesList = await db.all(getDirectorMoviesQuery)
  const directorMoviesArray = directorMovieItem => {
    return {
      movieName: directorMovieItem.movie_name,
    }
  }
  response.send(directorMoviesList.map(eachMovie => directorMoviesArray(eachMovie)))
})
