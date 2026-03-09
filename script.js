const searchBtn = document.getElementById('searchBtn');
const movieInput = document.getElementById('movieInput');
const results = document.getElementById('results');
const favoritesList = document.getElementById('favoritesList');

const API_KEY = "5048fcc6";

async function searchMovies(query) {
  try {
    results.innerHTML = `<div class="loader"></div>`;

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    console.log("APIからのレスポンス：", data);

    if (data.Response === "False") {
      results.innerHTML = `<p>検索結果が見つかりませんでした。</p>`;
      return;
    }

    results.innerHTML = "";
    data.Search.forEach(movie => {
      const div = document.createElement("div");
      div.classList.add('movie-card');
      div.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}" alt="Poster">
        <h3>${movie.Title}</h3>
        <p>公開年：${movie.Year}</p>
        <button class="favorite-btn" data-id="${movie.imdbID}">☆ お気に入りに追加</button>
      `;
      results.appendChild(div);
    });

    const favButtons = document.querySelectorAll('.favorite-btn');
    favButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const movieId = btn.dataset.id;
        const movieTitle = btn.closest('.movie-card').querySelector('h3').innerText;
        const moviePoster = btn.closest('.movie-card').querySelector('img').src;

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favorites.some((m) => m.id === movieId)) {
          alert("この映画はすでにお気に入りに登録されています");
          return;
        }

        favorites.push({
          id: movieId,
          title: movieTitle,
          poster: moviePoster
        });

        localStorage.setItem('favorites', JSON.stringify(favorites));

        const msg = document.createElement('p');
        msg.innerText = `"${movieTitle}"をお気に入りに追加しました`;
        msg.classList.add('save-msg');
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);

        renderFavorites();
      });
    });
  } catch (error) {
    console.error("エラー:", error);
    results.innerHTML = `<p>データ取得中にエラーが発生しました。</p>`;
  }
}

function handleSearch() {
  const query = movieInput.value.trim();
  if ( query === "" ) {
    alert('映画タイトルを入力してください');
    return;
  }

  searchMovies(query);
}

searchBtn.addEventListener('click', handleSearch);

movieInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
});

function renderFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  favoritesList.innerHTML = "";

  favorites.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('favorite-card');

    div.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="${
        movie.poster !== "N/A" ? movie.poster : "https://via.placeholder.com/150"
      }" alt="Poster">
      <button class="delete-btn" data-id="${movie.id}">削除</button>
    `;

    favoritesList.appendChild(div);

    div.querySelector('.delete-btn').addEventListener('click', () => {
      const updatedFavorites = favorites.filter((m) => m.id !== movie.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

      const msg = document.createElement('p');
      msg.innerText = `"${movie.title}"をお気に入りから削除しました`;
      msg.classList.add('delete-msg');
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2000);

      renderFavorites();
    });
  });
}

renderFavorites();