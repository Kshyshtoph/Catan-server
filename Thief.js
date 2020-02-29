class Thief {
  constructor() {
    this.x = 25;
    this.y = 25;
    this.isSet = false;
    this.stealFrom = [];
    this.active = false;
    this.popupWidth = 0;
    this.stealFrom = [];
  }
  handleStealing = steal => {
    const stealIndexes = [];
    for (let i = 0; i < players[steal].resources.length; i++) {
      if (players[steal].resources[i] > 0) {
        stealIndexes.push(i);
      }
    }
    if (stealIndexes === []) return;
    const stealIndex = Math.floor(Math.random() * stealIndexes.length);
    players[steal].resources[stealIndexes[stealIndex]] -= 1;
    players[activePlayerIndex].resources[stealIndexes[stealIndex]] += 1;
  };
}
module.exports = {
  Thief: Thief
};
