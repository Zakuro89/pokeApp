const combatZone = document.getElementById("battle-container");
const cardsContainer = document.getElementById("pokemon-cards-container");
const chooseOpponentContainer = document.getElementById(
  "choose-opponent-container"
);

const params = new URLSearchParams(window.location.search);
const pokemon1Id = params.get("pokemon1");
const pokemon2Id = params.get("pokemon2");

init();

function init() {
  cardsContainer.innerHTML = "";

  if (!pokemon1Id && !pokemon2Id) {
    chooseOpponentContainer.innerHTML = `
      <h2>Choisissez vos Pokémon</h2>
      <button onclick="chooseRandom(1)">Choisir Pokémon 1 Aléatoire</button>
      <button onclick="chooseRandom(2)">Choisir Pokémon 2 Aléatoire</button>
    `;
  } else if (pokemon1Id && !pokemon2Id) {
    displaySinglePokemon(pokemon1Id, 1);
    chooseOpponentContainer.innerHTML = `
      <h2>Choisissez Pokémon 2</h2>
      <button onclick="chooseRandom(2)">Choisir Pokémon 2 Aléatoire</button>
    `;
  } else if (!pokemon1Id && pokemon2Id) {
    displaySinglePokemon(pokemon2Id, 2);
    chooseOpponentContainer.innerHTML = `
      <h2>Choisissez Pokémon 1</h2>
      <button onclick="chooseRandom(1)">Choisir Pokémon 1 Aléatoire</button>
    `;
  } else {
    displayBattle();
  }
}

function chooseRandom(player) {
  const randomId = Math.floor(Math.random() * 151) + 1;

  if (player === 1) {
    window.location.href = `pokemon-battle.html?pokemon1=${randomId}&pokemon2=${
      pokemon2Id || ""
    }`;
  } else {
    window.location.href = `pokemon-battle.html?pokemon1=${pokemon1Id}&pokemon2=${randomId}`;
  }
}

async function getPokemonById(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération du Pokémon ${id}`);
  }
  return await response.json();
}

async function displaySinglePokemon(id, player) {
  try {
    const pokemon = await getPokemonById(id);
    createPokemonCard(pokemon, player === 1 ? "left" : "right");
  } catch (error) {
    console.error(error);
    cardsContainer.innerHTML = `<p class="error">Erreur: ${error.message}</p>`;
  }
}

async function displayBattle() {
  try {
    const [pkmn1, pkmn2] = await Promise.all([
      getPokemonById(pokemon1Id),
      getPokemonById(pokemon2Id),
    ]);
    createPokemonCard(pkmn1, "left");
    createPokemonCard(pkmn2, "right");
  } catch (error) {
    console.error(error);
    cardsContainer.innerHTML = `<p class="error">Erreur: ${error.message}</p>`;
  }
}

function createPokemonCard(pokemon, side) {
  const card = document.createElement("div");
  card.classList.add("pokemon-battle-card", side);

  card.innerHTML = `
    <h2>${pokemon.name.toUpperCase()}</h2>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <div class="battle-stats">
      <p><strong>PV:</strong> ${pokemon.stats[0].base_stat}</p>
      <p><strong>Attaque:</strong> ${pokemon.stats[1].base_stat}</p>
      <p><strong>Défense:</strong> ${pokemon.stats[2].base_stat}</p>
      <p><strong>Vitesse:</strong> ${pokemon.stats[5].base_stat}</p>
    </div>
  `;

  cardsContainer.appendChild(card);
}
