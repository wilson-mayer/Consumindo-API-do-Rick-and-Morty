const cardsContainer = document.querySelector(".container-cards");

let currentePage = 1;
const ItemsPerPage = 6;

function getCharacters(page) {
  api
    .get(`/character/?page=${page}`)
    .then((response) => {
      const characters = response.data.results;

      const startIndex = (page - 1) * ItemsPerPage;
      const endIndex = startIndex + ItemsPerPage;
      const slicedCharacters = characters.slice(startIndex, endIndex);

      console.log(response);
      console.log(response.data.info);

      slicedCharacters.forEach((character) => {
        const characterCard = document.createElement("div");
        characterCard.classList.add("character-card");

        characterCard.innerHTML = `
        <div class="border border-success rounded">
        <img src='${character.image}'alt=''>
        <h5>${character.name}</h5>
        <p>${character.status} - ${character.species}</p>

        <p>Ultima localização conhecida <br> ${character.location.name}</p>
        <p> <a href='${character.url}'>Detalhes do personagem</a></p></div>`;

        cardsContainer.appendChild(characterCard);
      });
    })
    .catch((error) => console.error("erro ao obter dados", error));
}

getCharacters(currentePage);
