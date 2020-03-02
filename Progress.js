class Progress {
  handlePopup = e => {
    players[activePlayerIndex].progressCards.push({
      type: this.generateCard(),
      age: currentRound
    });
    players[activePlayerIndex].resources[1] -= 1;
    players[activePlayerIndex].resources[3] -= 1;
    players[activePlayerIndex].resources[4] -= 1;
    io.emit("resources updated");
    io.emit("progress cards updated");
  };
  handleCardPlay = (card, i) => {
    switch (card.type) {
      case 1:
        if (card.age < currentRound) {
          board.thief.isSet = false;
          players[activePlayerIndex].progressCards.splice(i, 1);
          players[activePlayerIndex].knightsPlayed++;
        }
        break;
      case 2:
        players[activePlayerIndex].victoryPoints++;
        players[activePlayerIndex].progressCards.splice(i, 1);
        break;
      case 3:
        if (card.age < currentRound) {
          players[activePlayerIndex].progressCards.splice(i, 1);
        }
        break;
      case 4:
        if (card.age < currentRound) {
          players[activePlayerIndex].freeRoads = 2;
          players[activePlayerIndex].progressCards.splice(i, 1);
        }
        break;
      case 5:
        if (card.age < currentRound) {
          players[activePlayerIndex].freeResources = 2;
          players[activePlayerIndex].progressCards.splice(i, 1);
        }
        break;
    }
    io.emit("progress cards updated");
  };
  generateCard = () => {
    const card = Math.random();
    if (card < 0.5) return 1;
    else if (card < 0.75) return 2;
    else if (card < 0.85) return 3;
    else if (card < 0.9) return 4;
    else return 5;
  };
  handleMonopoly = i => {
    let numberOfResources = 0;
    players.forEach(player => {
      numberOfResources += player.resources[i];
      player.resources[i] = 0;
    });
    players[activePlayerIndex].resources[i] = numberOfResources;
    io.emit("resources updated");
  };
  handleInvention = i => {
    if (players[activePlayerIndex].freeResources > 0) {
      players[activePlayerIndex].resources[i] += 1;
      players[activePlayerIndex].freeResources--;
      io.emit("resources updated");
    }
  };
}

module.exports = { Progress };
