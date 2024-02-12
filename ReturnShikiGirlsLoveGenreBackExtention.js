// ==UserScript==
// @name         Return Shiki Genries Back
// @namespace    http://shikimori.me/
// @version      1.0.0
// @description  Возвращает жанры произведений на основе MyAnimeList API
// @author       SergeevSergey99
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @icon         https://www.google.com/s2/favicons?domain=shikimori.me
// @license      MIT
// @grant        GM_xmlhttpRequest
// ==/UserScript==

function getMALId() {
  // Находим элемент ссылки на странице
  var linkElement = document.querySelector('a.b-link[href*="myanimelist.net/anime/"]');

  if (linkElement)
  {
      // Извлекаем href атрибут из элемента
      var href = linkElement.getAttribute('href');

      // Используем регулярное выражение для извлечения ID
      var animeIdMatch = href.match(/myanimelist\.net\/anime\/(\d+)/);
      if (animeIdMatch)
          return animeIdMatch[1]; // ID аниме
  }
}
function addTagToGenres(genres){

  var isGirlsLove = false;
  genres.forEach(genre => { if (genre["name"] === "Girls Love") isGirlsLove = true;});
  
  if (isGirlsLove) {
    var entryInfo = document.querySelector('.b-entry-info');
    if (entryInfo) {
      var genres = entryInfo.children[4].children[0].children[1];
      if (genres) {
          genres.innerHTML += '<a class="b-tag bubbled-processed" style="color: red;" data-predelay="350" href="https://myanimelist.net/anime/genre/26/Girls_Love"><span class="genre-en">Girls Love</span><span class="genre-ru">Юри</span></a>';
      }
    }
  }
}
// Функция для запроса к API MyAnimeList
function fetchAnimeInfo(id) {
  var url = `https://api.myanimelist.net/v2/anime/${id}?fields=genres`;
  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    headers: {
      'X-MAL-CLIENT-ID': '9d7bf93c6c8472da45e14c86c9d37948'
    },
    onload: function(response) {
      var result = JSON.parse(response.responseText);
      addTagToGenres(result["genres"]);
    },
    onerror: function(error) {
      console.error('Request failed', error);
    }
  });
}
if (window.location.pathname.match(/\/animes\/.+/)) {
  fetchAnimeInfo(getMALId());
}

