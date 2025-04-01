const combatZone = document.getElementById("battle-container");
const params = new URLSearchParams(window.location.search);
const pokemon1Id = params.get("pokemon1");

if (pokemon1Id) {
  combatZone.innerHTML = `
        <h2>Choisissez l'adversaire</h2>
        <button onclick="chooseRandomOpponent()">Adversaire Aléatoire</button>
        <button onclick="chooseFromList()">Choisir dans une liste</button>
    `;
} else {
  combatZone.innerHTML = `
        <h2>Choisissez vos Pokémon</h2>
        <div>
            <h3>Pokémon 1</h3>
            <button onclick="chooseRandom(1)">Aléatoire</button>
            <button onclick="chooseFromList(1)">Choisir</button>
        </div>
        <div>
            <h3>Pokémon 2</h3>
            <button onclick="chooseRandom(2)">Aléatoire</button>
            <button onclick="chooseFromList(2)">Choisir</button>
        </div>
    `;
}

function chooseRandomOpponent() {
  const randomId = Math.floor(Math.random() * 151) + 1;
  window.location.href = `pokemon-battle.html?pokemon1=${pokemon1Id}&pokemon2=${randomId}`;
}

function chooseRandom(player) {
  const randomId = Math.floor(Math.random() * 151) + 1;
  window.location.href = `pokemon-battle.html?pokemon${player}=${randomId}&pokemon2=${pokemon1Id}`;
}

function chooseFromList(player) {
  console.log("liste pokemon");
}

function getPokemonParams() {
  const params = new URLSearchParams(window.location.search);
  const pokemon1 = params.get("pokemon1");
  const pokemon2 = params.get("pokemon2");

  return {
    pokemon1: pokemon1 ? pokemon1 : null,
    pokemon2: pokemon2 ? pokemon2 : null,
  };
}

const { pokemon1, pokemon2 } = getPokemonParams();
console.log("Pokemon 1:", pokemon1, "Pokemon 2:", pokemon2);

async function getPokemonById(id) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return pokemon.json();
}

async function displayPokemon() {
  let pkmn1 = await getPokemonById(pokemon1);
  let pkmn2 = await getPokemonById(pokemon2);

  createPokemonCard(pkmn1, "left");
  createPokemonCard(pkmn2, "right");
}

function createPokemonCard(pokemon, side) {
  const container = document.getElementById("battle-container");
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

  container.appendChild(card);
}

displayPokemon();

async function createPokemonCard(pokemon, side) {
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

  console.log("Pokémon ajouté:", pokemon);

  const randomMoves = getRandomMoves(pokemon.moves, 4);
  await displayMoves(randomMoves, card); // On passe la carte en argument
}

async function displayMoves(moves, card) {
  console.log("Affichage des attaques...");

  const moveContainer = document.createElement("div");
  moveContainer.classList.add("pokemon-moves");

  for (const move of moves) {
    const moveDetails = await fetchMoveDetails(move.move.url);
    const moveElement = document.createElement("div");
    moveElement.classList.add("move-card");

    const frenchMove = moveDetails.names.find(
      (name) => name.language.name === "fr"
    );

    moveElement.innerHTML = `
      <h4>${frenchMove ? frenchMove.name : moveDetails.name}</h4>
      <p><strong>Puissance:</strong> ${moveDetails.power || "N/A"}</p>
      <p><strong>Précision:</strong> ${moveDetails.accuracy || "N/A"}</p>
      <p><strong>Type:</strong> ${moveDetails.type.name}</p>
    `;

    moveContainer.appendChild(moveElement);
  }

  card.appendChild(moveContainer); // On ajoute le conteneur des attaques à la carte du Pokémon
}

async function createPokemonCard(pokemon, side) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("pokemon-container", side);

  const card = document.createElement("div");
  card.classList.add("pokemon-battle-card");

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

  const attackCard = document.createElement("div");
  attackCard.classList.add("pokemon-move-card");

  const randomMoves = getRandomMoves(pokemon.moves, 4);
  await displayMoves(randomMoves, attackCard);

  if (side === "left") {
    cardContainer.appendChild(attackCard); // Attaques à gauche
    cardContainer.appendChild(card);
  } else {
    cardContainer.appendChild(card);
    cardContainer.appendChild(attackCard); // Attaques à droite
  }

  cardsContainer.appendChild(cardContainer);
}
