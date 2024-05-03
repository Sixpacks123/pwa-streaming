const API_KEY = '71f3cc9cefcffc5bca87e0d0d7e6286a';
const BASE_URL = 'https://api.themoviedb.org/3';
const MOVIE_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`;

document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(err => console.error('Service Worker Registration Failed:', err));
    }
});

function fetchMovies() {
    fetch(MOVIE_URL)
        .then(response => response.json())
        .then(data => displayMovies(data.results))
        .catch(error => console.error('Error fetching data:', error));
}

function displayMovies(movies) {
    const container = document.getElementById('movie-container');
    container.innerHTML = '';
    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.className = 'movie';
        movieEl.innerHTML = `
            <h2>${movie.title}</h2>
            <p>Date de sortie: ${movie.release_date}</p>
            <p>Vote moyen: ${movie.vote_average}</p>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <button onclick="toggleFavorite(${JSON.stringify(movie)})">Favoris</button>
        `;
        container.appendChild(movieEl);
    });
}

function toggleFavorite(movie) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const movieIndex = favorites.findIndex(fav => fav.id === movie.id);
    if (movieIndex >= 0) {
        favorites.splice(movieIndex, 1); // Remove from favorites
    } else {
        favorites.push(movie); // Add to favorites
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Favoris mis à jour');
}

function searchMovies(event) {
    const searchTerm = event.target.value.toLowerCase();
    const allMovies = document.querySelectorAll('.movie');
    allMovies.forEach(movie => {
        const title = movie.querySelector('h2').textContent.toLowerCase();
        movie.style.display = title.includes(searchTerm) ? '' : 'none';
    });
}
