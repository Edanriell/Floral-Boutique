import image0 from "../../img/cards/card-img1.png";
import image1 from "../../img/cards/card-img2.png";
import image2 from "../../img/cards/card-img3.png";
import image3 from "../../img/cards/card-img4.png";
import image4 from "../../img/cards/card-img5.png";
import image5 from "../../img/cards/card-img6.png";
import image6 from "../../img/cards/card-img7.png";
import image7 from "../../img/cards/card-img8.png";
import image8 from "../../img/cards/card-img9.png";

import getResource from "../services/requests";

export default class Cards {
	static images = [image0, image1, image2, image3, image4, image5, image6, image7, image8];

	constructor({ container, triggerBtn }) {
		this.container = document.querySelector(container);
		this.trigger = document.querySelector(triggerBtn);
		this.cardsFetched = 0;
		this.cardsPerCycle = 1;
	}

	init() {
		getResource("http://localhost:3000/Flowers")
			.then(cards => this.renderCards(cards))
			.catch(error => {
				if (error.name === "NetworkError") {
					this.displayErrorMessage(
						`Неполадка сетевого подключения. 
             			 Пожалуйста, проверьте своё подключение к интернету.`
					);
				} else if (error instanceof TypeError) {
					this.displayErrorMessage("Ошибка сервера. Повторите попытку позже.");
				} else {
					this.displayErrorMessage(error);
				}
			});
	}

	renderCards(cards) {
		for (let i = 0; i < this.cardsPerCycle; i++) {
			const { id, name, price } = cards[this.cardsFetched];
			const card = document.createElement("li");
			card.classList.add("page-main__products__content__card", "fade-in-left");
			card.innerHTML = `
        <article class="page-main__products__content__card__item">
          <h3
            class="page-main__products__content__card__item__product-name"
          >
            ${name}
          </h3>
          <img
            src="${this.findImage(id)}"
            alt="Букет розовых цветов"
            width="320"
            height="270"
            class="page-main__products__content__card__item__image"
          />
          <p
            class="page-main__products__content__card__item__product-price"
          >
            ${price}
          </p>
          <button
            type="button"
            class="page-main__products__content__card__item__make-order-btn"
          >
            Заказать
          </button>
        </article>
        `;
			this.container.appendChild(card);
			this.cardsFetched++;
		}
		if (this.cardsFetched === cards.length) {
			this.trigger.classList.add("fade-out-bck");
			setTimeout(() => {
				this.trigger.remove();
			}, 400);
		}
	}

	displayErrorMessage(errorText) {
		if (!document.querySelector(".message")) {
			const error = document.createElement("div");
			error.classList.add("message", "error", "fade-in-fwd");
			error.innerHTML = `
        <p class="error__text">Ошибка</p>- ${errorText}
      `;
			this.container.appendChild(error);
			setTimeout(() => {
				error.classList.remove("fade-in-fwd");
				error.classList.add("fade-out-bck");
				setTimeout(() => {
					error.remove();
				}, 700);
			}, 8000);
		}
	}

	waitAndFetchElements(interval, max = Infinity) {
		function until(time) {
			// eslint-disable-next-line no-promise-executor-return
			return new Promise(resolve => setTimeout(resolve, time - Date.now()));
		}
		return {
			startTime: Date.now(),
			count: 1,
			async next() {
				if (this.count > max) {
					return { done: true };
				}
				const targetTime = this.startTime + this.count * interval;
				await until(targetTime);
				return { value: this.count++ };
			},
			[Symbol.asyncIterator]() {
				return this;
			}
		};
	}

	getCardsOnClick() {
		this.trigger.addEventListener("click", () => {
			(async () => {
				for await (const tick of this.waitAndFetchElements(200, 3)) {
					this.init();
					console.log(tick);
				}
			})();
		});
	}

	findImage(id) {
		const image = Cards.images.find((img, index) => index === id);
		return image;
	}
}
