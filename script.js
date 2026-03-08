const searchBtn = document.getElementById('searchBtn');
const movieInput = document.getElementById('movieInput');
const results = document.getElementById('results');

const API_KEY = "5048fcc6";

async function searchMovies(query) {
  try {
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
      div.innerHTML = `
        <h3>${movie.Title} (${movie.Year})</h3>
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"} alt="Poster">
      `;
      results.appendChild(div);
    });
  } catch (error) {
    console.error("エラー:", error);
    results.innerHTML = `<p>データ取得中にエラーが発生しました。</p>`;
  }
}

searchBtn.addEventListener('click', () => {
  const query = movieInput.value.trim();

  if ( query === "" ) {
    alert('映画タイトルを入力してください');
    return;
  }

  searchMovies(query);
});