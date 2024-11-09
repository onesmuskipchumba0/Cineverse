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
import { auth } from './config/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

function NavBar() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [genres, setGenres] = useState([])
  const [showGenreMenu, setShowGenreMenu] = useState(false)
  const genreDropdownRef = useRef(null)
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

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

  useEffect(() => {
    // Add this effect to listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Show welcome message when user logs in
    if (user) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [user]);

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

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
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
          <form onSubmit={handleSearch} className="nav-search" style={{ margin: '0 80px', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search movies & shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: '40px' }}
            />
            <button type="submit" className="search-button" style={{ position: 'absolute', right: '8px' }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </form>
          
          {user ? (
            <div className="user-menu">
              <div className="user-profile">
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="profile-pic"
                />
                <span className="user-name">{user.displayName?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="logout-button" title="Logout">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button onClick={handleLogin} className="auth-button">
              Sign In
            </button>
          )}

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

      {/* Welcome Toast */}
      {showWelcome && user && (
        <div className="welcome-toast">
          <div className="welcome-toast-content">
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="welcome-profile-pic"
            />
            <div className="welcome-message">
              <span className="welcome-text">Welcome back,</span>
              <span className="welcome-name">{user.displayName}</span>
            </div>
          </div>
        </div>
      )}
    </>
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
