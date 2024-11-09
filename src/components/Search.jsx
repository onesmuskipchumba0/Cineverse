import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

function Search() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setLoading(true)
      fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
      )
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results || [])
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error searching:', error)
          setLoading(false)
        })
    } else {
      setResults([])
    }
  }, [searchParams])

  if (loading) return <div>Loading...</div>

  return (
    <div className="container">
      <h1>Search Results for: {searchParams.get('q')}</h1>
      {results.length === 0 ? (
        <p>No results found</p>
      ) : (
        <div className="movies-grid">
          {results.map((item) => (
            <div key={item.id} className="movie-card">
              <img
                src={item.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Image'}
                alt={item.title || item.name}
              />
              <h2>{item.title || item.name}</h2>
              <p>{item.release_date || item.first_air_date}</p>
              <p>{item.overview?.slice(0, 150)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Search 