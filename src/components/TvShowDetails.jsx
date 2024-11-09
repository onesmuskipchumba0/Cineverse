import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'

function TvShowDetails() {
  const { id } = useParams()
  const [show, setShow] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const [showRes, creditsRes] = await Promise.all([
          api.fetchTvShowDetails(id),
          api.fetchTvShowCredits(id)
        ])
        
        const showData = await showRes.json()
        const creditsData = await creditsRes.json()
        
        setShow({
          ...showData,
          cast: creditsData.cast.slice(0, 10),
          crew: creditsData.crew.filter(person => 
            person.job === "Executive Producer" || person.job === "Creator"
          )
        })
      } catch (error) {
        console.error('Error fetching TV show details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchShowDetails()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!show) return <div>TV Show not found</div>

  return (
    <div className="movie-details">
      <div className="movie-hero" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), 
        url(https://image.tmdb.org/t/p/original${show.backdrop_path})`
      }}>
        <div className="movie-hero-content">
          <img 
            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
            alt={show.name}
            className="movie-poster"
          />
          <div className="movie-info">
            <h1>{show.name}</h1>
            <p className="release-date">First aired: {show.first_air_date}</p>
            <div className="genres">
              {show.genres.map(genre => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="rating">
              ⭐ {show.vote_average.toFixed(1)} / 10
            </div>
            <p className="overview">{show.overview}</p>
          </div>
        </div>
      </div>

      <div className="movie-details-content">
        <section className="cast-section">
          <h2>Cast</h2>
          <div className="cast-grid">
            {show.cast.map(person => (
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
              <h3>Creator</h3>
              <p>{show.created_by?.[0]?.name || "N/A"}</p>
            </div>
            <div>
              <h3>Seasons</h3>
              <p>{show.number_of_seasons}</p>
            </div>
            <div>
              <h3>Episodes</h3>
              <p>{show.number_of_episodes}</p>
            </div>
            <div>
              <h3>Status</h3>
              <p>{show.status}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default TvShowDetails 