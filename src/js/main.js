import "../sass/main.sass";

import Cards from "./modules/cards";

window.addEventListener("DOMContentLoaded", () => {
	const cards = new Cards({
		container: ".page-main__products__content",
		triggerBtn: ".page-main__products__show-more-products-btn"
	});

	cards.getCardsOnClick();
});
