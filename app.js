const API_KEY = '71f3cc9cefcffc5bca87e0d0d7e6286a';
const BASE_URL = 'https://api.themoviedb.org/3';
const MOVIE_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`;
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    document.getElementById('showFavorites').addEventListener('click', showFavorites);
    document.getElementById('showAllMovies').addEventListener('click', showAllMovies);
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(err => console.error('Service Worker Registration Failed:', err));
    }
});

function fetchMovies() {
    fetch(MOVIE_URL)
        .then(response => response.json())
        .then(data => displayMovies(data.results, 'movie-container'))
        .catch(error => console.error('Error fetching data:', error));
}

function displayMovies(movies, containerId, isFavoriteView = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';  // Clear existing content
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    movies.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.className = 'movie';

        const title = document.createElement('h2');
        title.textContent = movie.title;
        movieEl.appendChild(title);

        const releaseDate = document.createElement('p');
        releaseDate.textContent = `Date de sortie: ${movie.release_date}`;
        movieEl.appendChild(releaseDate);

        const voteAverage = document.createElement('p');
        voteAverage.textContent = `Vote moyen: ${movie.vote_average}`;
        movieEl.appendChild(voteAverage);

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = movie.title;
        movieEl.appendChild(img);

        const favButton = document.createElement('button');
        // Check if the movie is in favorites and update button text accordingly
        const isFavorited = favorites.some(fav => fav.id === movie.id);
        favButton.textContent = isFavorited ? 'Enlever des favoris' : 'Ajouter aux favoris';
        favButton.addEventListener('click', () => {
            toggleFavorite(movie, isFavoriteView);
            if (isFavoriteView) {
                displayMovies(favorites.filter(fav => fav.id !== movie.id), containerId, isFavoriteView);
            } else {
                displayMovies(movies, containerId, isFavoriteView);
            }
        });
        movieEl.appendChild(favButton);

        container.appendChild(movieEl);
    });
}


function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    displayMovies(favorites, 'favorites-container');
    document.getElementById('favorites-container').style.display = 'block';
    document.getElementById('movie-container').style.display = 'none';
    document.getElementById('showFavorites').style.display = 'none';
    document.getElementById('showAllMovies').style.display = 'inline';
}

function showAllMovies() {
    fetchMovies();
    document.getElementById('favorites-container').style.display = 'none';
    document.getElementById('movie-container').style.display = 'block';
    document.getElementById('showFavorites').style.display = 'inline';
    document.getElementById('showAllMovies').style.display = 'none';
}


function toggleFavorite(movie, isFavoriteView) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(f => f.id === movie.id);
    if (index !== -1) {
        favorites.splice(index, 1);  // Remove the movie from favorites
    } else {
        favorites.push(movie);  // Add the movie to favorites
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert(isFavoriteView ? 'Film enlevé des favoris' : 'Film ajouté aux favoris');
    // Refresh the view to update button text and list
    displayMovies(isFavoriteView ? favorites : movies, isFavoriteView ? 'favorites-container' : 'movie-container', isFavoriteView);
}


function searchMovies(event) {
    const searchTerm = event.target.value.toLowerCase();
    const allMovies = document.querySelectorAll('.movie');
    allMovies.forEach(movie => {
        const title = movie.querySelector('h2').textContent.toLowerCase();
        movie.style.display = title.includes(searchTerm) ? '' : 'none';
    });
}
