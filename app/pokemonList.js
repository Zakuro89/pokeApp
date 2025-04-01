const pokedex = document.getElementById("pokedex");
const typeFilter = document.getElementById("type-filter");
let pokemons = [];
let shinyMode = false;

const shinyButton = document.getElementById("shiny-mode");

async function fetchPokemonData() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();

  const pokemonList = data.results;

  for (const pokemon of pokemonList) {
    const detailsResponse = await fetch(pokemon.url);
    const pokemonData = await detailsResponse.json();

    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();

    const frenchName =
      speciesData.names.find((name) => name.language.name === "fr")?.name ||
      pokemonData.name;

    const types = pokemonData.types.map((t) => t.type.name);

    pokemons.push({
      id: pokemonData.id,
      name: frenchName,
      image: shinyMode
        ? pokemonData.sprites.front_shiny
        : pokemonData.sprites.front_default,
      types: types,
    });
  }

  loadTypeFilter();
  displayPokemon(pokemons);
}

function toggleShinyMode() {
  shinyMode = !shinyMode;

  document.body.classList.toggle("shiny-mode-active", shinyMode);
  document.body.style.backgroundColor = shinyMode ? "#fff8dc" : "#606060";

  for (let pokemon of pokemons) {
    pokemon.image = shinyMode
      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`
      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  }

  if (shinyMode) {
    console.log("ON");
  } else {
    console.log("OFF");
  }

  displayPokemon(pokemons);
}

shinyButton.addEventListener("click", toggleShinyMode);

function displayPokemon(pokemons) {
  pokedex.innerHTML = "";

  pokemons.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${pokemon.name}</h3>
      <img src="${pokemon.image}" alt="${pokemon.name}">
    `;

    card.addEventListener("click", () => {
      window.location.href = `pokemon-details.html?id=${pokemon.id}`;
    });

    pokedex.appendChild(card);
  });
}

async function loadTypeFilter() {
  const response = await fetch("https://pokeapi.co/api/v2/type");
  const data = await response.json();

  const types = data.results
    .map((type) => type.name)
    .filter((typeName) => typeName !== "unknown");

  console.log(types);

  for (let type of types) {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    typeFilter.appendChild(option);
  }
}

typeFilter.addEventListener("change", () => {
  const selectedType = typeFilter.value;

  if (selectedType === "all") {
    displayPokemon(pokemons);
  } else {
    const filteredPokemon = pokemons.filter((pokemon) =>
      pokemon.types.includes(selectedType)
    );
    displayPokemon(filteredPokemon);
  }
});

fetchPokemonData();
