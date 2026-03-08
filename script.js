const searchBtn = document.getElementById('searchBtn');
const movieInput = document.getElementById('movieInput');

searchBtn.addEventListener('click', () => {
  const query = movieInput.value.trim();

  if ( query === "" ) {
    alert('映画タイトルを入力してください');
    return;
  }

  console.log("検索ワード：", query);
});