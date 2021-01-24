
//Card Object
class Card {
  constructor(country, place, imageUrl, date, plans) {
    this.country = country;
    this.place = place;
    this.imageUrl = imageUrl;
    this.date = date;
    this.plans = plans;
  }

  static cardId = -1;
}

class Ui {
  constructor(localStorageName) {
    this.localStorageName = localStorageName;
  }

  addCard(card) {
    if (this.validateInputs(card)) {
      this.addCardElement(card);
      this.storeCardToLocalStorage(card);
      this.clearInputs();
    }
  }

  addCardElement(card) {
    const gridContainer = document.querySelector(".cards-grid-container");
    let dayDiff = this.getDateDifference(Date.parse(card.date), Date.parse(new Date));
    
    const cardContainer = document.createElement("div");

    cardContainer.className = "card-container";
    cardContainer.innerHTML = `
                    <div class="card" id="cardNo${card.cardId}">
                        <div class="front">
                            <h2 class="place-name">${card.place}</h2>
                            <h2 class="days-diff">${dayDiff}</h2>
                            <img class="front-img" src="${card.imageUrl}" alt="">
                        </div>
                        <div class="back">
                        <h4 id = "card-number">${card.cardId}</h4>
                        <p><span class = "back-side-info">Country: </span>${card.country}</p>
                        <p><span class = "back-side-info">Place: </span>${card.place}</p>
                        <p><span class = "back-side-info">Date: </span>${card.date}</p>
                        <p><span class = "back-side-info">Plans: </span>${card.plans}</p>
                        <i class="fas fa-trash-alt remove-btn" id="remove"></i>
                    </div>
                    </div>
    `;

    gridContainer.appendChild(cardContainer);
  }

  storeCardToLocalStorage(card) {
    if (localStorage.getItem(this.localStorageName) == null) {
      let cards = new Array(card);
      let cardsStr = JSON.stringify(cards);

      localStorage.setItem(this.localStorageName, cardsStr);
    } else {
      let storedCards = [];
      storedCards = JSON.parse(localStorage.getItem(this.localStorageName));

      let cards = [...storedCards, card];
      let cardsStr = JSON.stringify(cards);

      localStorage.setItem(this.localStorageName, cardsStr);
    }
  }

  removeCardFromLocalStorage(cardId) {
    if (localStorage.getItem(this.localStorageName) !== null) {
      let storedCards = JSON.parse(localStorage.getItem(this.localStorageName));
      let filteredcards = storedCards.filter((card) => card.cardId != cardId);
      let filteredCardsStr = JSON.stringify(filteredcards);

      localStorage.setItem(this.localStorageName, filteredCardsStr);
    }
  }

  loadCardsFromLocalStorage() {
    if (localStorage.getItem(this.localStorageName) != null) {
      let storedCards = JSON.parse(localStorage.getItem(this.localStorageName));

      storedCards.forEach((card) => {
        this.addCardElement(card);
      });
    }
  }

  getMaxCardsId() {
    if (localStorage.getItem(this.localStorageName) != null) {
      let storedCards = [];
      storedCards = JSON.parse(localStorage.getItem(this.localStorageName));

      if (storedCards.length === 0) {
        return 0;
      } else {
        let idArray = [];

        storedCards.forEach((card) => {
          idArray.push(card.cardId);
        });

        let max = Math.max(...idArray);

        return max;
      }
    } else {
      return 0;
    }
  }

  getDateDifference(cardDate, todayDate) {
    const dateDiff = Math.ceil(Math.abs(cardDate - todayDate) / (1000 * 3600 * 24));
    return (dateDiff === 1 ? `${dateDiff} day to go` : `${dateDiff} days to go`);
  }

  validateInputs(card) {
    //validation
    if (
      card.place === "" ||
      card.country === "" ||
      card.imageUrl === "" ||
      card.date === ""
    ) {
      this.showAlert("You should fill in all fields except your plans!", "red");

      return false;
    } else {
      this.showAlert("You made the card!", "green");

      return true;
    }
  }

  showAlert(message, color) {
    const alert = document.createElement("h2");

    alert.classList.add("alert");
    alert.style.color = color;
    alert.textContent = message;

    document.querySelector(".form").appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 2000);
  }

  clearInputs() {
    document.getElementById("country").value = "";
    document.getElementById("place").value = "";
    document.getElementById("img").value = "";
    document.getElementById("date").value = "";
    document.getElementById("plans").value = "";
  }
}

class App {
  static ui;

  static init(localStorageName) {
    this.ui = new Ui(localStorageName);
    this.ui.loadCardsFromLocalStorage();

    const cardsGridContainer = document.querySelector(".cards-grid-container");

    cardsGridContainer.addEventListener("click", (event) => {
      const target = event.target;
      const id = target.id;
      if (id !== "remove") {
        let closestCard = target.closest(".card");

        if (closestCard) {
          target.closest(".card").classList.toggle("card-clicked");
        }
      } else {
        target.parentElement.parentElement.parentElement.remove();

        const cardId = parseInt(
          target.parentElement.parentElement.querySelector("h4").innerHTML
        );

        this.ui.removeCardFromLocalStorage(cardId);
      }
    });

    document
      .querySelector(".submit-btn")
      .addEventListener("click", function (event) {
        event.preventDefault();

        const country = document.getElementById("country").value;
        const place = document.getElementById("place").value;
        const img = document.getElementById("img").value;
        const date = document.getElementById("date").value;
        const plans = document.getElementById("plans").value;

        //Instantiate card
        const card = new Card(country, place, img, date, plans);
        card.cardId = App.ui.getMaxCardsId() + 1;

        //Add Card
        App.ui.addCard(card);
      });
  }
}

App.init("travelBacketDb");
