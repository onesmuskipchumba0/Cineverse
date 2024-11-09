import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Movies from './components/Movies'
import TvShows from './components/TvShows'
import Search from './components/Search'
import GenreResults from './components/GenreResults'
import MovieDetails from './components/MovieDetails'
import TvShowDetails from './components/TvShowDetails'
import './App.css'
import { BiCameraMovie } from 'react-icons/bi'
import { FaGithub } from 'react-icons/fa'

function NavBar() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [genres, setGenres] = useState([])
  const [showGenreMenu, setShowGenreMenu] = useState(false)
  const genreDropdownRef = useRef(null)

  useEffect(() => {
    // Fetch genres when component mounts
    fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => setGenres(data.genres))
      .catch((error) => console.error('Error fetching genres:', error))

    // Add click outside listener
    const handleClickOutside = (event) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
        setShowGenreMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleGenreClick = (genreId) => {
    navigate(`/genre/${genreId}`)
    setShowGenreMenu(false)
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <BiCameraMovie className="nav-logo" />
        <span>CineVerse</span>
      </Link>
      
      <div className="nav-links">
        <Link to="/">Movies</Link>
        <Link to="/tv">TV Shows</Link>
        <div className="genre-dropdown" ref={genreDropdownRef}>
          <button 
            className="nav-link-button"
            onClick={() => setShowGenreMenu(!showGenreMenu)}
          >
            Genres
          </button>
          {showGenreMenu && (
            <div className="genre-menu">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.id)}
                  className="genre-item"
                >
                  {genre.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="nav-right">
        <form onSubmit={handleSearch} className="nav-search">
          <input
            type="text"
            placeholder="Search movies & shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        
        <a 
          href="https://github.com/onesmuskipchumba0" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
        >
          <FaGithub />
        </a>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />
        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="/tv" element={<TvShows />} />
          <Route path="/search" element={<Search />} />
          <Route path="/genre/:genreId" element={<GenreResults />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/tv/:id" element={<TvShowDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
