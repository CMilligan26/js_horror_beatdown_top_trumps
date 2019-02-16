document.addEventListener('DOMContentLoaded', () => {
  const newCard = document.querySelector('#new_card');
  newCard.addEventListener('submit', createCard);
})

const categories = ['strength', 'scariness_rating', 'supernatural_rating', 'psychological_damage_rating'];
let battleCards = [];
let cardOneWins = 0;
let cardTwoWins = 0;
let number = 0;
let gameOn = false;
let rounds = 0;

createCard = function () {
  event.preventDefault();
  const card = document.createElement('section');
  addHeaderToCard(card);
  addCardImageToCard(card);
  addCardDataItemsToCard(card);
  addCardDescriptionToCard(card);
  const cardList = document.querySelector('#card_list');
  cardList.appendChild(card);
  this.reset();
  displayStartGameButton();
}

addHeaderToCard = function (card) {
  const container = document.createElement('header');
  const name = document.createElement('h4');
  name.textContent = this.character_name.value;
  const movie = document.createElement('h6');
  movie.textContent = '(' + this.movie.value + ')';
  container.appendChild(name);
  container.appendChild(movie);
  card.appendChild(container);
}

addCardImageToCard = function (card) {
  const image = document.createElement('img');
  if (this.image.value === '') {
    image.src = "https://loremflickr.com/500/500/"+this.character_name.value;
  }
  else {
    image.src = this.image.value;
  }
  card.appendChild(image);
}

addCardDescriptionToCard = function (card) {
  const container = document.createElement('footer');
  const description = document.createElement('p');
  description.textContent = this.description.value;
  container.appendChild(description);
  card.appendChild(container);
}

createCardDataItem = function (data_item) {
  const item = document.createElement('p');
  item.textContent = data_item.replace(/\_/g, ' ').toUpperCase() + ': ' + this[data_item].value;
  return item;
}

addCardDataItemsToCard = function (card) {
  const card_items = document.createElement('div');
  categories.forEach((category) => {
    const paragraph = createCardDataItem(category);
    paragraph.className = category;
    card_items.appendChild(paragraph);
  });
  card.appendChild(card_items);
}

displayStartGameButton = function () {
  const cards = document.querySelectorAll('section');
  if (cards.length > 1 && document.querySelector('#start_match') === null) {
    const header = document.querySelector('header');
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'start_match';
    button.className = 'start_button';
    button.textContent = 'START BEATDOWN';
    button.addEventListener('click', hideCards);
    header.appendChild(button);
  };
}

hideCards = function () {
  const button = document.querySelector(`header`).querySelector(`button`)
  button.hidden = true;
  if (gameOn === false) {
    const cards = document.querySelectorAll('section');
    for (const card of cards) {
      card.hidden = true;
    }
    displayRandomCardOne();
  }
    else {fullBattle();}
  }

  displayRandomCardOne = function () {
    const cards = document.querySelectorAll('section');
    const firstCard = getRandomInt(0,cards.length-1);
    cards[firstCard].hidden = false;
    battleCards.push(firstCard);
    displayRandomCardTwo(firstCard);
  }

  getRandomInt = function (minnum, maxnum) {
    const min = Math.ceil(minnum);
    const max = Math.floor(maxnum);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  displayRandomCardTwo = function (firstCardNumber) {
    let secondCard = -1;
    const cards = document.querySelectorAll('section');
    while (secondCard < 0 || secondCard === firstCardNumber) {
      secondCard = getRandomInt(0,cards.length);
    }
    cards[secondCard].hidden = false;
    battleCards.push(secondCard);
    createVs();
    createWinCounters();
    fullBattle();
  }

  fullBattle = function () {
    match();
  }

  match = function () {
    number = getRandomInt(0, categories.length);
    delayActionShort(battle);
    delayActionLong(createSlash);
    delayActionLonger(finishBattle);
  }

  createVs = function () {
    const vs = document.createElement('img');
    vs.src = "http://static1.comicvine.com/uploads/original/11112/111129141/5440487-1122329314-52705.png";
    vs.className = "vs";
    const add = document.querySelector('html');
    add.appendChild(vs);
  }

  createWinCounters = function () {
    const playerOne = document.createElement('p');
    playerOne.textContent = cardOneWins;
    playerOne.className = "player_one_counter"
    const add = document.querySelector('html');
    add.appendChild(playerOne);
    const playerTwo = document.createElement('p');
    playerTwo.textContent = cardTwoWins;
    playerTwo.className = "player_two_counter"
    add.appendChild(playerTwo);
  }

  battle = function () {
    const vs = document.querySelector('.vs');
    vs.className += " fade_out";
    const battle = document.createElement('p');
    battle.textContent = `Battle: ${categories[number].replace(/\_/g, ' ').toUpperCase()}`;
    battle.className = "battle";
    const add = document.querySelector('html');
    add.appendChild(battle);
    const cardItems = document.querySelectorAll(`.${categories[number]}`);
    cardItems.forEach((card) => {
      card.className +=  " selected_trait";
    });
  }

  createSlash = function () {
    battleCards.sort(function(a, b) {return a - b;}); //In order to access the cards in the correct order that they appear on the screen and not the order they were selected this needs to be sorted.
    const slash = document.createElement('img');
    slash.src = "http://pluspng.com/img-png/claw-png-hd-file-claw-marks-png-1600.png";
    const cards = document.querySelectorAll('section');
    const cardOneItem = cards[battleCards[0]].querySelector(`div`).querySelector(`.${categories[number]}`);
    const cardTwoItem = cards[battleCards[1]].querySelector(`div`).querySelector(`.${categories[number]}`);
    const cardOneValue = cardOneItem.textContent.split('').filter(letter => letter.match(/[0-9]/)).join('');
    const cardTwoValue = cardTwoItem.textContent.split('').filter(letter => letter.match(/[0-9]/)).join('');
    const cardOneNum = parseInt(cardOneValue, 10);
    const cardTwoNum = parseInt(cardTwoValue, 10);
    if (cardOneNum > cardTwoNum){
      slash.className = "card_two_lose";
      cardOneWins += 1;
    } else if (cardTwoNum > cardOneNum) {
      slash.className = "card_one_lose";
      cardTwoWins += 1;
    } else {
      slash.className = "card_draw"
    };
    slash.className += " slash";
    const add = document.querySelector('html');
    add.appendChild(slash);
  }

  finishBattle = function () {
    rounds += 1;
    updateCounters();
    hideBattleText();
    hideSlash();
    selectedTrait = document.querySelectorAll('.selected_trait');
    selectedTrait.forEach(object => object.classList.remove("selected_trait"));
    gameOn = true;
    const button = document.querySelector(`header`).querySelector(`button`)
    if (rounds !== 3 && cardOneWins !== 2 && cardTwoWins !== 2) {
      button.click();
    }
    else {
      declareWinner();
    }
  }

  updateCounters = function () {
    const playerOne = document.querySelector('.player_one_counter');
    playerOne.textContent = cardOneWins;
    const playerTwo = document.querySelector('.player_two_counter');
    playerTwo.textContent = cardTwoWins;
  }

  hideBattleText = function () {
    const battleText = document.querySelector('.battle');
    battleText.className = "fade_out";
    battleText.remove();
  }

  hideSlash = function () {
    const slash = document.querySelector('.slash');
    slash.className = "fade_out";
    slash.remove();
  }

  declareWinner = function () {
    const winner = document.createElement('p');
    winner.className = "winner";
    const cards = document.querySelectorAll('section');
    const cardOneItem = cards[battleCards[0]].querySelector(`header`).querySelector(`h4`);
    const cardTwoItem = cards[battleCards[1]].querySelector(`header`).querySelector(`h4`);
    if (cardOneWins > cardTwoWins) {
      winner.textContent = `${cardOneItem.textContent} WINS`;
    }
    else if (cardTwoWins > cardOneWins) {
      winner.textContent = `${cardTwoItem.textContent} WINS`;
    }
    else {winner.textContent = 'DRAW'}
    const add = document.querySelector('html');
    add.appendChild(winner);
    delayActionLong(finishGame);
  }

  finishGame = function () {
    const winnerText = document.querySelector(`.winner`);
    winnerText.remove();
    const vs = document.querySelector(`.vs`);
    vs.remove();
    const poc = document.querySelector(`.player_one_counter`);
    poc.remove();
    const ptc = document.querySelector(`.player_two_counter`);
    ptc.remove();
    battleCards = [];
    cardOneWins = 0;
    cardTwoWins = 0;
    number = 0;
    gameOn = false;
    rounds = 0;
    const cards = document.querySelectorAll('section');
    for (const card of cards) {
      card.hidden = false;
    }
    const button = document.querySelector(`header`).querySelector(`button`)
    button.hidden = false;
  }

  delayActionShort = function (code) {
    setTimeout(code,3000);
  }

  delayActionLong = function (code) {
    setTimeout(code,6000);
  }

  delayActionLonger = function (code) {
    setTimeout(code,10000);
  }
