const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const api = {
  // ... existing methods ...
  
  fetchMovieDetails: (movieId) =>
    fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`),
    
  fetchMovieCredits: (movieId) =>
    fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`),
    
  fetchTvShowDetails: (showId) =>
    fetch(`${BASE_URL}/tv/${showId}?api_key=${API_KEY}&language=en-US`),
    
  fetchTvShowCredits: (showId) =>
    fetch(`${BASE_URL}/tv/${showId}/credits?api_key=${API_KEY}&language=en-US`),
    
  fetchSimilarMovies: (movieId) =>
    fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`)
}; 