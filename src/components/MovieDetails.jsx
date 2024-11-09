import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [similarMovies, setSimilarMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieRes, creditsRes, similarRes] = await Promise.all([
          api.fetchMovieDetails(id),
          api.fetchMovieCredits(id),
          api.fetchSimilarMovies(id)
        ])
        
        const [movieData, creditsData, similarData] = await Promise.all([
          movieRes.json(),
          creditsRes.json(),
          similarRes.json()
        ])
        
        setMovie({
          ...movieData,
          cast: creditsData.cast.slice(0, 10),
          crew: creditsData.crew.filter(person => 
            person.job === "Director" || person.job === "Producer"
          )
        })
        setSimilarMovies(similarData.results.slice(0, 6))
      } catch (error) {
        console.error('Error fetching movie details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
    window.scrollTo(0, 0) // Scroll to top when loading new movie
  }, [id])

  const handleGenreClick = (genreId) => {
    navigate(`/genre/${genreId}`)
  }

  const handleSimilarMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`)
  }

  if (loading) return <div>Loading...</div>
  if (!movie) return <div>Movie not found</div>

  return (
    <div className="movie-details">
      <div className="movie-hero" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), 
        url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
      }}>
        <div className="movie-hero-content">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="movie-poster"
          />
          <div className="movie-info">
            <h1>{movie.title}</h1>
            <p className="release-date">{movie.release_date}</p>
            <div className="genres">
              {movie.genres.map(genre => (
                <span 
                  key={genre.id} 
                  className="genre-tag"
                  onClick={() => handleGenreClick(genre.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="rating">
              ⭐ {movie.vote_average.toFixed(1)} / 10
            </div>
            <p className="overview">{movie.overview}</p>
          </div>
        </div>
      </div>

      <div className="movie-details-content">
        <section className="cast-section">
          <h2>Cast</h2>
          <div className="cast-grid">
            {movie.cast.map(person => (
              <div key={person.id} className="cast-card">
                <img 
                  src={person.profile_path 
                    ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                    : 'https://via.placeholder.com/200x300?text=No+Image'
                  }
                  alt={person.name}
                />
                <h3>{person.name}</h3>
                <p>{person.character}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="details-section">
          <h2>Details</h2>
          <div className="details-grid">
            <div>
              <h3>Director</h3>
              <p>{movie.crew.find(p => p.job === "Director")?.name || "N/A"}</p>
            </div>
            <div>
              <h3>Runtime</h3>
              <p>{movie.runtime} minutes</p>
            </div>
            <div>
              <h3>Budget</h3>
              <p>${(movie.budget / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <h3>Revenue</h3>
              <p>${(movie.revenue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </section>

        {similarMovies.length > 0 && (
          <section className="similar-section">
            <h2>Similar Movies</h2>
            <div className="similar-grid">
              {similarMovies.map(movie => (
                <div 
                  key={movie.id} 
                  className="similar-card"
                  onClick={() => handleSimilarMovieClick(movie.id)}
                >
                  <img 
                    src={movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : 'https://via.placeholder.com/200x300?text=No+Image'
                    }
                    alt={movie.title}
                  />
                  <h3>{movie.title}</h3>
                  <p>{movie.release_date?.split('-')[0]}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default MovieDetails 