const pokemonDetails = document.getElementById("pokemonDetails");
const pokemonName = document.getElementById("pokemonName");
const pokemonImage = document.getElementById("pokemonImage");
const pokemonTypes = document.getElementById("pokemonTypes");
const pokemonStats = document.getElementById("pokemonStats");

function getPokemonIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function getPokemonDetails() {
  const pokemonId = getPokemonIdFromUrl();

  if (!pokemonId) {
    pokemonDetails.innerHTML = "<p>Pokémon non trouvé.</p>";
    return;
  }

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  );
  const pokemon = await response.json();

  const speciesResponse = await fetch(pokemon.species.url);
  const speciesData = await speciesResponse.json();

  const frenchName =
    speciesData.names.find((name) => name.language.name === "fr")?.name ||
    pokemon.name;

  pokemonName.innerHTML = frenchName;

  pokemonImage.src = pokemon.sprites.other.home.front_default;

  pokemonTypes.innerHTML = `<strong>Types:</strong> ${pokemon.types
    .map((t) => t.type.name)
    .join(", ")}`;

  pokemonStats.innerHTML = `
    <strong>Statistiques:</strong>
    <ul>
      <li><strong>PV:</strong> ${pokemon.stats[0].base_stat}</li>
      <li><strong>Attaque:</strong> ${pokemon.stats[1].base_stat}</li>
      <li><strong>Défense:</strong> ${pokemon.stats[2].base_stat}</li>
      <li><strong>Attaque Spéciale:</strong> ${pokemon.stats[3].base_stat}</li>
      <li><strong>Défense Spéciale:</strong> ${pokemon.stats[4].base_stat}</li>
      <li><strong>Vitesse:</strong> ${pokemon.stats[5].base_stat}</li>
    </ul>
    `;

  const randomMoves = getRandomMoves(pokemon.moves, 4);

  displayMoves(randomMoves);
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

async function displayMoves(moves) {
  pokemonMoves.innerHTML = "";

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

    pokemonMoves.appendChild(moveElement);
  }
}

async function fetchMoveDetails(moveUrl) {
  const response = await fetch(moveUrl);
  return await response.json();
}

const battleButton = document.getElementById("battle-button");
const pokemonId = getPokemonIdFromUrl();

battleButton.addEventListener("click", () => {
  window.location.href = `pokemon-battle.html?pokemon1=${pokemonId}`;
});

getPokemonDetails();
