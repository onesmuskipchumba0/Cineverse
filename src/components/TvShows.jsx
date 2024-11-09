import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function TvShows() {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&page=1`
        )
        const data = await response.json()
        setShows(data.results)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching TV shows:', error)
        setLoading(false)
      }
    }

    fetchShows()
  }, [])

  const handleShowClick = (showId) => {
    navigate(`/tv/${showId}`)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container">
      <h1>Popular TV Shows</h1>
      <div className="movies-grid">
        {shows.map((show) => (
          <div 
            key={show.id} 
            className="movie-card"
            onClick={() => handleShowClick(show.id)}
          >
            <img
              src={show.poster_path 
                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'
              }
              alt={show.name}
            />
            <h2>{show.name}</h2>
            <p>{show.first_air_date}</p>
            <p>{show.overview?.slice(0, 150)}...</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TvShows
