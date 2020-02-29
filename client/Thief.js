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
  draw = () => {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 25, 0, (2 * Math.PI) / 180, true);
    ctx.fill();
  };
  drawPlayersPopup = () => {
    if (this.stealFrom.length === 0) {
      this.active = false;
      return;
    }
    this.popupWidth = this.stealFrom.length * 100;
    const popupHeight = 100;
    ctx.fillStyle = "burlywood";
    ctx.fillRect(300 - this.popupWidth / 2, 200, this.popupWidth, popupHeight);
    for (let i = 0; i < this.stealFrom.length; i++) {
      ctx.fillStyle = this.stealFrom[i];
      ctx.fillRect(325 - this.popupWidth / 2 + 100 * i, 225, 50, 50);
    }
  };
  handlePlayersPopup = e => {
    for (let i = 0; i < this.stealFrom.length; i++) {
      if (
        e.offsetX < 375 - this.popupWidth / 2 + i * 100 &&
        e.offsetX > 325 - this.popupWidth / 2 + i * 100 &&
        e.offsetY > 225 &&
        e.offsetY < 275
      ) {
        const steal = players.findIndex(
          player => player.colour === this.stealFrom[i]
        );
        this.active = false;
        sendThief(steal);
        this.stealFrom = [];
      }
    }
  };
  handleStealing = (steal, stealPlayerIndex) => {
    const stealIndexes = [];
    for (let i = 0; i < steal.resources.length; i++) {
      if (steal.resources[i] > 0) {
        stealIndexes.push(i);
      }
    }
    if (this.stealIndexes === []) return;
    const stealIndex = Math.floor(Math.random() * stealIndexes.length);
    steal.resources[stealIndexes[stealIndex]] -= 1;
    currentPlayer.resources[stealIndexes[stealIndex]] += 1;
  };
}
