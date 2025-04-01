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
}

getPokemonDetails();

const battleButton = document.getElementById("battle-button");
const pokemonId = getPokemonIdFromUrl();

battleButton.addEventListener("click", () => {
  window.location.href = `pokemon-battle.html?pokemon1=${pokemonId}`;
});

fetchPokemonDetails();
