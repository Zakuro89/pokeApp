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

async function createPokemonCard(pokemon, side) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("pokemon-container", side);

  const card = document.createElement("div");
  card.classList.add("pokemon-battle-card", side);

  const nameDatas = await fetch(pokemon.species.url);
  const nameResults = await nameDatas.json();

  const frenchName =
    nameResults.names.find((name) => name.language.name === "fr")?.name ||
    pokemon.name;

  card.innerHTML = `
    <h2>${frenchName.toUpperCase()}</h2>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <div class="battle-stats">
      <p><strong>PV:</strong> ${pokemon.stats[0].base_stat}</p>
      <p><strong>Attaque:</strong> ${pokemon.stats[1].base_stat}</p>
      <p><strong>Défense:</strong> ${pokemon.stats[2].base_stat}</p>
      <p><strong>Vitesse:</strong> ${pokemon.stats[5].base_stat}</p>
    </div>
  `;

  cardsContainer.appendChild(card);

  console.log(pokemon);

  const randomMoves = getRandomMoves(pokemon.moves, 4);

  await displayMoves(randomMoves, frenchName.toUpperCase(), side);
}

async function displayMoves(moves, pokemonName, side) {
  const container = document.getElementById(
    side === "left" ? "left-attack-table" : "right-attack-table"
  );

  container.innerHTML = "";

  const title = document.createElement("h3");
  title.textContent = `Attaques de ${pokemonName}`;
  container.appendChild(title);

  for (const move of moves) {
    const moveDetails = await fetchMoveDetails(move.move.url);
    const moveElement = document.createElement("div");
    moveElement.classList.add("move");

    const frenchMove = moveDetails.names.find(
      (name) => name.language.name === "fr"
    );

    moveElement.innerHTML = `
      <strong>${frenchMove ? frenchMove.name : moveDetails.name}</strong> 
      <br>Puissance: ${moveDetails.power || "N/A"} 
      <br>Précision: ${moveDetails.accuracy || "N/A"} 
      <br>Type: ${moveDetails.type.name}
    `;

    container.appendChild(moveElement);
  }
}

function getRandomMoves(moves, numberOfMoves) {
  const randomMoves = [];
  while (randomMoves.length < numberOfMoves) {
    const randomIndex = Math.floor(Math.random() * moves.length);
    const move = moves[randomIndex];

    if (!randomMoves.includes(move)) {
      randomMoves.push(move);
    }
  }
  return randomMoves;
}

async function fetchMoveDetails(moveUrl) {
  const response = await fetch(moveUrl);
  return await response.json();
}

function startBattle() {
  console.log(
    "Faire système de combat avec choix d'attaque... pas eu le temps d'implémenter la méthode..."
  );
}
