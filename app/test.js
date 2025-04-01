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
