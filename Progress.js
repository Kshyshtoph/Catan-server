class Progress {
  handlePopup = e => {
    players[activePlayerIndex].progressCards.push({
      type: this.generateCard(),
      age: currentRound
    });
    currentPlayer.resources[1] -= 1;
    currentPlayer.resources[3] -= 1;
    currentPlayer.resources[4] -= 1;
    io.emit("resources updated");
    io.emit("progress cards updated");
  };
  handleCardPlay = (card, i) => {
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
    if (currentPlayer.freeResources > 0) {
      players[activePlayerIndex].resources[i] += 1;
      players[activePlayerIndex].freeResources--;
      io.emit("resources updated");
    }
  };
}

module.exports = { Progress };
