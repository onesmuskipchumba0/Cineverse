import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function GenreResults() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [genreName, setGenreName] = useState('')
  const { genreId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch genre name
    fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => {
        const genre = data.genres.find((g) => g.id === parseInt(genreId))
        setGenreName(genre?.name || '')
      })

    // Fetch movies by genre
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=${genreId}&language=en-US&sort_by=popularity.desc&page=1`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching movies:', error)
        setLoading(false)
      })
  }, [genreId])

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container">
      <h1>{genreName} Movies</h1>
      <div className="movies-grid">
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            className="movie-card"
            onClick={() => handleMovieClick(movie.id)}
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Image'
              }
              alt={movie.title}
            />
            <h2>{movie.title}</h2>
            <p>{movie.release_date}</p>
            <p>{movie.overview?.slice(0, 150)}...</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GenreResults 