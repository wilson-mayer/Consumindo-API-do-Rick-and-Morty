const cardsContainer = document.querySelector(".container-cards");
const contentModal = document.querySelector(".modal");

// Função assíncrona para buscar todos os personagens de todas as páginas da API
async function getAllCharacters(
  url = "https://rickandmortyapi.com/api/character/"
) {
  try {
    let allCharacters = []; // Array para armazenar todos os personagens

    // Função recursiva para buscar personagens de todas as páginas
    async function getCharactersPages(url) {
      const response = await axios.get(url);

      // Obtém os dados da resposta
      const data = response.data;

      // Adiciona os personagens da página atual ao array
      allCharacters = allCharacters.concat(data.results);

      // Se houver uma próxima página, faz outra chamada recursiva
      if (data.info.next) {
        await getCharactersPages(data.info.next);
      }
    }

    // Inicia a busca dos personagens
    await getCharactersPages(url);

    // Retorna todos os personagens coletados
    return allCharacters;
  } catch (error) {
    // Lida com erros de solicitação aqui
    console.error("Erro ao buscar personagens:", error);
    throw error;
  }
}

// Exemplo de como usar a função getAllCharacters
let currentPage = 1; // Variável para armazenar a página atual
const pageNumber = document.getElementById("pageNumber");

// Função para carregar os personagens de uma página específica
async function getCharacters(page = 1) {
  try {
    const allCharacters = await getAllCharacters();
    const charactersPerPage = 6;
    const startIndex = (page - 1) * charactersPerPage;
    const endIndex = startIndex + charactersPerPage;
    const charactersToShow = allCharacters.slice(startIndex, endIndex);

    // Limpa o conteúdo anterior
    cardsContainer.innerHTML = "";

    // Exibe os personagens da página atual
    charactersToShow.forEach((character) => {
      const characterCard = document.createElement("div");
      characterCard.classList.add("character-card");
      const details = character.url;

      characterCard.innerHTML = `
        <div class="card bg-transparent">
            <img src='${character.image}' alt='' class="card-img-top">
            <div class="card-body bg-transparent border border-top-0 border-success rounded-bottom">
            <p class="card-text text-white lh-base">${character.status} - ${character.species}</p>
            <button type="button" class="btn btn-primary" id="abrirModal">
        Abrir Modal
    </button>
            <p class="card-text text-white-50 fs-6 lh-1">Ultima localização conhecida:</p><p class="card-text text-white fs-6">${character.location.name}</p>
            
            </div>
            </div>
            `;

      cardsContainer.appendChild(characterCard);

      document
        .getElementById("abrirModal")
        .addEventListener("click", function () {
          // Crie o conteúdo da modal
          const modalContent = `
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">Título modal</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Conteúdo da modal -->
                            ...
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-primary">Entendido</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

          // Insira o conteúdo da modal no container
          document.getElementById("modalContainer").innerHTML = modalContent;

          // Abre o modal
          var myModalEl = document.getElementById("staticBackdrop");
          var myModal = new bootstrap.Modal(myModalEl);
          myModal.show();
        });
    });

    pageNumber.innerHTML = `<p class="page-link" >${page}</p>S`;

    console.log(allCharacters);
  } catch (error) {
    console.error("Erro ao buscar personagens:", error);
  }
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

function informationFooter() {
  axios
    .get(`https://rickandmortyapi.com/api/character/`)
    .then((response) => {
      const charactersNumber = response.data.info;

      const personagens = document.getElementById("personagens");
      personagens.innerHTML = `<p>PERSONAGENS: <span class="fontwhite">${charactersNumber.count}</span></p>`;

      return axios.get("https://rickandmortyapi.com/api/episode/");
    })
    .then((response) => {
      const episode = response.data.info;
      const episodios = document.getElementById("episodios");
      episodios.innerHTML = `<p>EPISÓDIOS: <span class="fontwhite"> ${episode.count}</span></p>`;

      return axios.get("https://rickandmortyapi.com/api/location?");
    })
    .then((response) => {
      const location = response.data.info;
      const localizacoes = document.getElementById("localizacoes");
      localizacoes.innerHTML = `<p>LOCALIZAÇÕES: <span class="fontwhite"> ${location.count}</span></p>`;
    })
    .catch((error) => console.error("erro ao obter dados", error));
}

informationFooter();
