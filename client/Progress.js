class Progress {
  constructor() {
    this.x = 365;
    this.y = 400;
    this.height = 75;
    this.width = 50;
    this.deck = new Image();
    this.deck.src = "./img/deck.png";
    this.knight = new Image();
    this.knight.src = "./img/knight.png";
    this.deck.onload = this.draw;
    this.closeBtn = new Image();
    this.closeBtn.src = "./img/closeBtn.png";
    this.monopoly = new Image();
    this.monopoly.src = "./img/monopoly.png";
    this.victoryPoint = new Image();
    this.victoryPoint.src = "./img/victoryPoint.png";
    this.invention = new Image();
    this.invention.src = "./img/invention.png";
    this.roadBuild = new Image();
    this.roadBuild.src = "./img/roadBuild.png";
    this.active = false;
    this.popupHeight = 0;
    this.popupWidth = 0;
    this.monopolyPopupActive = false;
    this.inventionPopupActive = false;
  }
  draw = () => {
    ctx.strokeStyle = "black";
    ctx.drawImage(this.deck, this.x, this.y);
    ctx.strokeRect(this.x, this.y, 50, 75);
  };
  drawPopup = () => {
    this.popupWidth =
      (players[myPlayer].progressCards.length < 4
        ? players[myPlayer].progressCards.length * 100
        : 400) + 200;
    this.popupHeight =
      Math.floor(players[myPlayer].progressCards.length / 4) * 125 + 150;
    ctx.fillStyle = "burlywood";
    ctx.fillRect(
      300 - this.popupWidth / 2,
      300 - this.popupHeight / 2,
      this.popupWidth,
      this.popupHeight
    );
    ctx.drawImage(
      this.closeBtn,
      300 + this.popupWidth / 2 - 50,
      300 - this.popupHeight / 2
    );
    ctx.drawImage(this.deck, 300 + this.popupWidth / 2 - 125, 266.5);
    this.handleCardDraw();
  };
  handlePopup = e => {
    for (let i = 0; i < players[myPlayer].progressCards.length; i++) {
      const x = 300 - this.popupWidth / 2 + (i % 4) * 100 + 25;
      const y = 300 - this.popupHeight / 2 + (i <= 3 ? 25 : 150);
      this.handleCardPlay(e, x, y, players[myPlayer].progressCards[i], i);
    }
    if (
      e.offsetX > 175 + this.popupWidth / 2 &&
      e.offsetX < 225 + this.popupWidth / 2 &&
      e.offsetY > 266.5 &&
      e.offsetY < 266.5 + 75 &&
      currentPlayer.canAffordProgressCard()
    ) {
      fetch("/progress", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          playerIndex: myPlayer
        })
      })
        .then(res => res.json())
        .then(res => {
          players[myPlayer].progressCards = res.progressCards;
        });
    }
    this.handlePopupClose(e);
  };
  handlePopupClose = e => {
    if (
      e.offsetX > 300 + this.popupWidth / 2 - 50 &&
      e.offsetX < this.popupWidth / 2 + 300 &&
      e.offsetY > 300 - this.popupHeight / 2 &&
      e.offsetY < 350 - this.popupHeight / 2
    ) {
      this.active = false;
    }
  };
  handleCardPlay = (e, x, y, card, i) => {
    const cardWidth = 50;
    const cardHeight = 75;
    if (
      e.offsetX > x &&
      e.offsetX < x + cardWidth &&
      e.offsetY > y &&
      e.offsetY < y + cardHeight
    ) {
      fetch("/card", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ card, i })
      });
      switch (card.type) {
        case 1:
          if (card.age < currentRound) {
            board.thief.isSet = false;
            currentPlayer.progressCards.splice(i, 1);
            currentPlayer.knightsPlayed++;
          }
          break;
        case 2:
          currentPlayer.victoryPoints++;
          currentPlayer.progressCards.splice(i, 1);
          break;
        case 3:
          if (card.age < currentRound) {
            this.monopolyPopupActive = true;
            currentPlayer.progressCards.splice(i, 1);
          }
          break;
        case 4:
          if (card.age < currentRound) {
            currentPlayer.freeRoads = 2;
            currentPlayer.progressCards.splice(i, 1);
          }
          break;
        case 5:
          if (card.age < currentRound) {
            currentPlayer.freeResources = 2;
            currentPlayer.progressCards.splice(i, 1);
            this.inventionPopupActive = true;
          }
          break;
      }
      this.active = false;
    }
  };
  handleCardDraw = () => {
    for (let i = 0; i < currentPlayer.progressCards.length; i++) {
      switch (currentPlayer.progressCards[i].type) {
        case 1:
          ctx.drawImage(
            this.knight,
            325 - this.popupWidth / 2 + (i % 4) * 100,
            300 - this.popupHeight / 2 + (i > 3 ? 150 : 25)
          );
          break;
        case 2:
          ctx.drawImage(
            this.victoryPoint,
            325 - this.popupWidth / 2 + (i % 4) * 100,
            300 - this.popupHeight / 2 + (i > 3 ? 150 : 25)
          );
          break;
        case 3:
          ctx.drawImage(
            this.monopoly,
            325 - this.popupWidth / 2 + (i % 4) * 100,
            300 - this.popupHeight / 2 + (i > 3 ? 150 : 25)
          );
          break;
        case 4:
          ctx.drawImage(
            this.roadBuild,
            325 - this.popupWidth / 2 + (i % 4) * 100,
            300 - this.popupHeight / 2 + (i > 3 ? 150 : 25)
          );
          break;
        case 5:
          ctx.drawImage(
            this.invention,
            325 - this.popupWidth / 2 + (i % 4) * 100,
            300 - this.popupHeight / 2 + (i > 3 ? 150 : 25)
          );
          break;
      }
    }
  };
  generateCard = () => {
    const card = Math.random();
    if (card < 0.5) return 1;
    else if (card < 0.75) return 2;
    else if (card < 0.85) return 3;
    else if (card < 0.9) return 4;
    else return 5;
  };
  drawMonopolyPopup = () => {
    ctx.fillStyle = "burlywood";
    ctx.strokeStyle = "black";
    ctx.fillRect(100, 200, 400, 125);
    const colours = ["green", "lime", "brown", "gray", "yellow"];
    colours.forEach((colour, index) => {
      ctx.fillStyle = colour;
      ctx.fillRect(125 + index * 75, 225, 50, 75);
    });
  };
  handleMonopolyPopup = e => {
    for (let i = 0; i < 5; i++) {
      let numberOfResources = 0;
      if (
        e.offsetX > 125 + i * 75 &&
        e.offsetX < 175 + i * 75 &&
        e.offsetY > 225 &&
        e.offsetY < 300
      ) {
        players.forEach(player => {
          numberOfResources += player.resources[i];
          player.resources[i] = 0;
        });
        currentPlayer.resources[i] = numberOfResources;
        fetch(`/monopoly/${i}`);
      }
      this.monopolyPopupActive = false;
    }
  };
  handleInventionPopup = e => {
    if (currentPlayer.freeResources > 0) {
      for (let i = 0; i < 5; i++) {
        if (
          e.offsetX > 125 + i * 75 &&
          e.offsetX < 175 + i * 75 &&
          e.offsetY > 225 &&
          e.offsetY < 300
        ) {
          currentPlayer.resources[i] += 1;
          currentPlayer.freeResources--;
          fetch(`/invention/${i}`);
          if (currentPlayer.freeResources === 0) {
            this.inventionPopupActive = false;
          }
        }
      }
    }
  };
}
