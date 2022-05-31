const apiurl = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1';



const searchapi = 'https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query='
const imagepath = 'https://image.tmdb.org/t/p/w1280'

let st = ""
const main = document.querySelector('main')
const favcontainer = document.getElementById('fav-container');
const form = document.getElementById('form')
const serchel = document.querySelector('#search')

// initialy get movies fav

getmovies()
showFavmovies();
async function getmovies(url = apiurl) {

    const response = await fetch(url);

    if (response.status >= 200 && response.status <= 299) {
        const resData = await response.json();
        console.log(resData)
        showmovies(resData.results, 'main')
    } else {
        console.log(response.status, response.statusText);
    }



}

function getclassbyRate(vote) {
    if (vote > 8) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}



function showmovies(movies, category) {

    //clear main
    if (category == 'main') {
        main.innerHTML = ''
    }
    if (category == 'fav') {
        favcontainer.innerHTML = ''
    }


    movies.forEach(movie => {

        const { poster_path, title, vote_average, overview, release_date } = movie
        if (poster_path != null) {
            const movieEl = document.createElement('div')
            movieEl.classList.add('movie')
            movieEl.innerHTML = `<img src="${imagepath+poster_path}" alt="${movie.title}">
                <div class="movie-info">
                    <h3>${title}</h3>
                    <span class=${getclassbyRate(vote_average)}>${vote_average}</span>
                </div>
                
                <div class='overview'>
                <h4>Release: Date:</h4> 
                ${movie.release_date}
                <h4>Overview:</h4> 
                ${overview}
                
                <i id="favicon" class="fa-solid fa-heart-circle-plus icon ${checkstatus(category,title)} "></i>
                </div>`


            const favIcon = movieEl.querySelector('#favicon')
            favIcon.addEventListener('click', () => {

                if (favIcon.classList.contains('active'))

                {

                    favIcon.classList.remove('active');
                    removeMealFromLS(movie.title);
                    showFavmovies()
                } else {

                    favIcon.classList.add('active')
                    const movieData = {
                        title: title,
                        poster_path: movie.backdrop_path,
                        vote_average: vote_average,
                        overview: overview,
                        release_date: release_date,

                    }
                    addtols(movieData)
                    showFavmovies()


                }

            });

            if (category == 'main') {
                main.appendChild(movieEl)
            } else {
                favcontainer.appendChild(movieEl)
            }
        }
    });
}




function checkstatus(cat, title) {
    st = ""
    if (cat == 'fav') {
        st = 'active'
    } else if (cat == 'main') {
        const movies = getMealFromLS();

        movies.forEach(movie => {

            if (movie.title === title) {

                st = 'active'
            }
        });
    }
    return st
}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchterm = serchel.value;
    if (searchterm) {
        getmovies(searchapi + searchterm)
        serchel.value = '';


    } else {
        getmovies()
    }



})



function addtols(movie) {
    const movieData = getMealFromLS()
    localStorage.setItem('movies', JSON.stringify([...movieData, movie]))
}

function getMealFromLS() {
    const moviesData = JSON.parse(localStorage.getItem('movies'));
    return moviesData == null ? [] : moviesData;
}

function removeMealFromLS(movietitle) {

    const movies = getMealFromLS();
    localStorage.clear('movies')
    movies.forEach(movie => {
        if (movie.title != movietitle) {
            addtols(movie)
        }
    })

    //  localStorage.clear('mealIds')
    console.log(movietitle)

}

function showFavmovies() {
    const movies = getMealFromLS();
    console.log(movies)
    if (movies) {

        showmovies(movies, 'fav');
    }
}

// script for sticky navbar

// When the user scrolls the page, execute myFunction
window.onscroll = function() { myFunction() };

// Get the navbar
var header = document.querySelector("header");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky")
    } else {
        header.classList.remove("sticky");
    }
}