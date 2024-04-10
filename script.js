const cardsContainer = document.querySelector(".container-cards");
const contentModal = document.querySelector(".modal");

let currentePage = 1;
const ItemsPerPage = 6;

function getCharacters(page = 1) {
  api
    .get(`/character/?page=${page}`)
    .then((response) => {
      const characters = response.data.results;

      if (response.data.info.next) {
        getCharacters(page + 1);
      } else {
        // Quando não houver mais páginas, faça algo com os personagens
        console.log("Todos os personagens foram buscados:", characters);
      }

      const charactersNumber = response.data.info;

      const startIndex = (page - 1) * ItemsPerPage;
      const endIndex = startIndex + ItemsPerPage;
      const slicedCharacters = characters.slice(startIndex, endIndex);

      console.log(response);
      console.log(response.data.info);

      const personagens = document.getElementById("personagens");
      personagens.innerHTML = `<p>PERSONAGENS: <span class="fontwhite">${charactersNumber.count}</span></p>`;

      characters.forEach((character) => {
        const characterCard = document.createElement("div");
        characterCard.classList.add("character-card");
        const details = character.url;

        characterCard.innerHTML = `
        <div class="card bg-transparent">
        <img src='${character.image}'alt=''class="card-img-top">
        <div class="card-body bg-transparent border  border-top-0 border-success rounded-bottom">
        <a href="${details}" class="card-title fw-bold fs-2 text-decoration-none nomehover lh-1">${character.name}</a>
        <p class="card-text text-white lh-base">${character.status} - ${character.species}</p>

        <p class="card-text text-white-50 fs-6 lh-1">Ultima localização conhecida:</p><p class="card-text text-white fs-5">${character.location.name}</p>
        
        </div>
        </div>
        
        
        `;

        cardsContainer.appendChild(characterCard);
      });

      return api.get("/episode/");
    })
    .then((response) => {
      const episode = response.data.info;
      const episodios = document.getElementById("episodios");
      episodios.innerHTML = `<p>EPISÓDIOS: <span class="fontwhite"> ${episode.count}</span></p>`;

      return api.get("/location?");
    })
    .then((response) => {
      const location = response.data.info;
      const localizacoes = document.getElementById("localizacoes");
      localizacoes.innerHTML = `<p>LOCALIZAÇÕES: <span class="fontwhite"> ${location.count}</span></p>`;
    })
    .catch((error) => console.error("erro ao obter dados", error));
}

// Função para carregar a próxima página
function loadNextPage() {
  currentePage++;
  cardsContainer.innerHTML = "";
  getCharacters(currentePage);
}

// Função para carregar a página anterior
function loadPreviousPage() {
  if (currentePage > 1) {
    currentePage--;
  }
  cardsContainer.innerHTML = "";
  getCharacters(currentePage);
}

// Carregar a primeira página ao carregar a página
window.onload = function () {
  getCharacters();
};
