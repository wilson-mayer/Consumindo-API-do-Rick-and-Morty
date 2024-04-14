const cardsContainer = document.querySelector(".container-cards");
const contentModal = document.querySelector(".modal");

// Array para armazenar todos os personagens
// Função assíncrona para buscar todos os personagens de todas as páginas da API
function getAllCharacters(url = "https://rickandmortyapi.com/api/character/") {
  return axios
    .get(url)
    .then((response) => {
      const data = response.data;
      const allCharacters = data.results;

      if (data.info.next) {
        return getAllCharacters(data.info.next).then((nextCharacters) => {
          return allCharacters.concat(nextCharacters);
        });
      }

      return allCharacters;
    })
    .catch((error) => {
      console.error("Erro ao buscar personagens:", error);
      throw error;
    });
}

let currentPage = 1;
const pageNumber = document.getElementById("pageNumber");

function getCharacters(page = 1) {
  getAllCharacters()
    .then((allCharacters) => {
      const charactersPerPage = 6;
      const startIndex = (page - 1) * charactersPerPage;
      const endIndex = startIndex + charactersPerPage;
      const charactersToShow = allCharacters.slice(startIndex, endIndex);

      cardsContainer.innerHTML = "";

      charactersToShow.forEach((character) => {
        const characterCard = document.createElement("div");
        characterCard.classList.add("character-card");
        const details = character.url;

        characterCard.innerHTML = `
        <div class="card bg-transparent ">
            <img src='${character.image}' alt='' class="card-img-top">
            <div class="card-body bg-transparent border border-3 border-top-0 border-success rounded-bottom">
            <a  class="card-title fw-bold fs-2 text-decoration-none nomehover lh-1" id="abrirModal${character.id}">
            ${character.name}
    </a>

            <p class="card-text text-white lh-base fs-5">${character.status} - ${character.species}</p>
            
            <p class="card-text text-white-50 fs-6 lh-1">Ultima localização conhecida:</p><p class="card-text text-white fs-5">${character.location.name}</p>
            </div>
            </div>
            `;

        cardsContainer.appendChild(characterCard);

        document
          .getElementById(`abrirModal${character.id}`)
          .addEventListener("click", function () {
            document.getElementById("modalContainer").innerHTML = `
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header justify-content-center   ">
                            <h1 class="modal-title fs-3 " id="staticBackdropLabel ">${character.name}</h1>
                        </div>
                        <div class="modal-body colormodal d-flex justify-content-center">
                        <div class="card bg-transparent cardModal">
                        <img  src='${character.image}' alt='' class="card-img-top">
                        <div class="card-body bg-transparent border border-3 border-top-0 border-success rounded-bottom">
                        <a href="${details}" target="_blank" class="card-title fw-bold fs-1 text-decoration-none nomehovermodal fontmodal lh-1">${character.name}</a>
                        <p class="card-text text-white lh-base fs-4 ">Status: ${character.status}</p> 
                        <p class="card-text text-white lh-base fs-4">Espécie: ${character.species} </p>
                        
                        <p class="card-text text-white lh-base fs-4">Gênero: ${character.gender} </p>
                        <p class="card-text text-white lh-base fs-4">Origem: ${character.origin.name} </p>
                       
                        <p class="card-text text-white-50 fs-5 lh-1">Ultima localização conhecida:</p><p class="card-text text-white fs-4">${character.location.name}</p>
                        
                        </div>
                        </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            
                        </div>
                    </div>
                </div>
            </div>
        `;

            var myModalEl = document.getElementById("staticBackdrop");
            var myModal = new bootstrap.Modal(myModalEl);
            myModal.show();
          });
      });

      pageNumber.innerHTML = `<p class="page-link bg-transparent text-warning fw-bold" >${page}</p>`;

      console.log(allCharacters);
    })
    .catch((error) => {
      console.error("Erro ao buscar personagens:", error);
    });
}

// <a href="${details}" class="card-title fw-bold fs-2 text-decoration-none nomehover lh-1">${character.name}</a>

// Função para carregar a próxima página
function loadNextPage() {
  currentPage++;
  getCharacters(currentPage);
}

// Função para carregar a página anterior
function loadPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
  }
  getCharacters(currentPage);
}

// Carregar a primeira página ao carregar a página
window.onload = function () {
  getCharacters();
};
let episode = [];
function informationFooter() {
  axios
    .get(`https://rickandmortyapi.com/api/character/`)
    .then((response) => {
      const charactersNumber = response.data.info;

      const personagens = document.getElementById("personagens");
      personagens.innerHTML = `<p>PERSONAGENS: <span class="fontwhite nomehovermodal">${charactersNumber.count}</span></p>`;

      return axios.get("https://rickandmortyapi.com/api/episode/");
    })
    .then((response) => {
      episode = response.data;
      const episodios = document.getElementById("episodios");
      episodios.innerHTML = `<p>EPISÓDIOS: <span class="fontwhite nomehovermodal"> ${episode.info.count}</span></p>`;

      return axios.get("https://rickandmortyapi.com/api/location?");
    })
    .then((response) => {
      const location = response.data.info;
      const localizacoes = document.getElementById("localizacoes");
      localizacoes.innerHTML = `<p>LOCALIZAÇÕES: <span class="fontwhite nomehovermodal"> ${location.count}</span></p>`;
    })
    .catch((error) => console.error("erro ao obter dados", error));
}

informationFooter();

const searchResults = document.getElementById("searchInput");

console.log(searchResults);

document
  .getElementById("fetchButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    axios
      .get(
        `https://rickandmortyapi.com/api/character/?name=${searchResults.value}`
      )
      .then((response) => {
        const search = response.data.results;

        search.forEach((character) => {
          document.getElementById("modalResults").innerHTML = `
          <div class="modal fade" id="resultsModal" tabindex="-1" aria-labelledby="resultsModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="resultsModalLabel">Resultados da Pesquisa</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <!-- Aqui você pode exibir os resultados da API -->
                      <!-- Por exemplo: <ul id="searchResults"></ul> -->
                      <div class="card bg-transparent cardModal">
                        <img  src='${character.image}' alt='' class="card-img-top">
                        <div class="card-body bg-transparent border border-3 border-top-0 border-success rounded-bottom">
                        <a href="${character.url}" target="_blank" class="card-title fw-bold fs-1 text-decoration-none nomehovermodal fontmodal lh-1">${character.name}</a>
                        <p class="card-text text-white lh-base fs-4 ">Status: ${character.status}</p> 
                        <p class="card-text text-white lh-base fs-4">Espécie: ${character.species} </p>
                        
                        <p class="card-text text-white lh-base fs-4">Gênero: ${character.gender} </p>
                        <p class="card-text text-white lh-base fs-4">Origem: ${character.origin.name} </p>
                       
                        <p class="card-text text-white-50 fs-5 lh-1">Ultima localização conhecida:</p><p class="card-text text-white fs-4">${character.location.name}</p>
                        
                        </div>
                  </div>
              </div>
          </div>
      </div>`;
          const resultsModal = new bootstrap.Modal(
            document.getElementById("resultsModal")
          );
          resultsModal.show();
        });
      })
      .catch((error) => {
        console.error("Erro na busca:", error);
      });
  });
