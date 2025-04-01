const pokedex = document.getElementById("pokedex");
const typeFilter = document.getElementById("typeFilter");
let pokemons = [];

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
      image: pokemonData.sprites.front_default,
      types: types,
    });
  }

  loadTypeFilter();

  displayPokemon(pokemons);
}

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
