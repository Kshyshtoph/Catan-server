class Settlement {
  constructor(player, id) {
    this.color = player.color;
    this.inPlay = false;
    this.id = id;
    this.type = "settlement";
    this.width = 20;
    this.height = 20;
    this.x = 500;
    this.y = this.id * 40 + 25;
    this.initialX = 500;
    this.initialY = this.y;
    this.active = false;
  }
}
class City extends Settlement {
  constructor(player, id) {
    super(player, id);
    this.x = 550 - this.width / 2;
    this.type = "city";
    this.y = this.id * 40 + 25;
  }
}
class Road {
  constructor(player, id) {
    this.color = player.color;
    this.neighbours = [];
    this.inPlay = false;
    this.type = "road";
    this.id = id;
    this.width = 20;
    this.height = 6;
    this.x = 475 + (this.id % 3) * 30;
    this.y = Math.floor(this.id / 3) * 40 + 250;
    this.active = false;
    this.direction = 20;
  }
}
module.exports = {
  Settlement: Settlement,
  City: City,
  Road: Road
};
