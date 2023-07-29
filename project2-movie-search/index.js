const ERROR = {
  NOT_FOUND: "Movie not found!"
}
function getAPIKey() {
  const API_KEY = localStorage.getItem("MOVIE_SEARCH_API_KEY");
  if (!API_KEY)
    alert(
      "Can not find API KEY, You need to get an API key from https://www.omdbapi.com/"
    );
  else return API_KEY;
}

function getData() {
  fetch(`http://www.omdbapi.com/?apikey=${getAPIKey()}&t=`)
    .then((res) => {
      console.log(res);
      if (res.status == 200) {
        document.querySelector(".api__status").dataset.status = "success";
      } else {
        document.querySelector(".api__status").dataset.status = "failed";
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function generateMovieListElement(data) {
  document
    .querySelector(".movie__list")
    .insertAdjacentHTML("afterbegin", movieDOMString(data));
}

function movieDOMString({ Poster, Title }) {
  return `
    <li class="movie" id="movie-id">
        <div class="movie__card">
            <div class="movie__poster">
                ${Poster != "N/A" ? `<img src="${Poster}" alt="movie poster image"/>` : "Not Available"}
            </div>
            <h2>${Title}</h2>
            <a href="#read-more">Watch Now</a>
        </div>
    </li>
    `;
}

function searchByMovieName(name) {
  fetch(`http://www.omdbapi.com/?apikey=${getAPIKey()}&t=${name}`)
    .then((res) => {
      if(res.status != 200) {
        alert("Something went wrong!")
        return
      }
      res.json().then((res) => {
        if(res.Error == ERROR.NOT_FOUND){
          alert("Movie Not found")
          return
        }
        generateMovieListElement(res)
      })
    })
    .catch((error) => {
      console.error(error);
    });
}

function handleSearch(e) {
  searchByMovieName(e.target.value);
}

document
  .querySelector(".search-movies")
  .addEventListener("change", handleSearch);
window.addEventListener("DOMContentLoaded", () => getAPIKey());
window.addEventListener("load", () => getData());
