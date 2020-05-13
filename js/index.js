class PokemonTCGCatalog {
  constructor() {
    this.pageSize = 4;
    this.currentPage = 1;

    this.cards = [];
    this.newCards = [];

    this.catalog = null;
    this.button = null;
    this.loader = null;
    this.search = null;

    this.API = "https://api.pokemontcg.io";
    this.API_VERSION = "v1";
    this.API_RESOURCE = "cards";

    this.API_ENDPOINT = `${this.API}/${this.API_VERSION}/${this.API_RESOURCE}`;

    this.UiSelectors = {
      content: "[data-content]",
      button: "[data-button",
      loader: "[data-loader]",
      search: "search",
      card: "[data-card]",
    };
  }

  async initializeCatalog() {
    this.catalog = document.querySelector(this.UiSelectors.content);
    this.button = document.querySelector(this.UiSelectors.button);
    this.loader = document.querySelector(this.UiSelectors.loader);
    this.search = document.getElementById(this.UiSelectors.search);

    this.addEventListeners();
    this.pullCards();
  }

  addEventListeners() {
    this.button.addEventListener("click", () => this.pullCards());
    this.search.addEventListener("keyup", () => this.filterCards());
  }

  async pullCards() {
    this.loader.classList.remove("hide");
    this.button.classList.add("hide");
    const { cards } = await this.fetchData(
      `${this.API_ENDPOINT}?page=${this.currentPage}&pageSize=${this.pageSize}`
    );

    this.loader.classList.add("hide");
    this.button.classList.remove("hide");

    this.cards = [...this.cards, ...cards];

    this.newCards = [...cards];
    this.createCatalog(this.newCards);
    this.currentPage++;
  }

  async fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  }

  createCatalog(cards) {
    this.catalog.insertAdjacentHTML("beforeend", [
      cards.map((card) => this.createCard(card)).join(""),
    ]);
  }

  createCard({ name, number, imageUrlHiRes, supertype, subtype, rarity, id }) {
    return `
      <article class="card" id=${id} data-card>
        <header class="card__header">
          <h2 class="card__heading">
          ${name}
          </h2>
          <p class="card__number">
          ${number}
          </p>
        </header>
        <img class="card__image" src="${imageUrlHiRes}" alt="${name}">
        <p class="card__description"><span class="bold">Supertype:</span>
        ${supertype}
        </p>
        <p class="card__description"><span class="bold">Subtype:</span> 
        ${subtype}
        </p>
        <p class="card__description"><span class="bold">Rarity:</span>
        ${rarity}
        </p>
      </article>
    `;
  }

  filterCards() {
    const searchQuery = this.search.value.toLowerCase();

    document
      .querySelectorAll(this.UiSelectors.card)
      .forEach((el) => el.classList.remove("hide"));

    const filteredCards = this.cards.filter(
      ({ name }) => !name.toLowerCase().includes(searchQuery)
    );

    filteredCards.forEach(({ id }) =>
      document.getElementById(id).classList.add("hide")
    );
  }
}
