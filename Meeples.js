class Settlement {
  constructor(player, id) {
    this.colour = player.colour;
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
  draw = () => {
    if (this.active && !this.inPlay) {
      ctx.fillStyle = "black";
      ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
    }
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}
class City extends Settlement {
  constructor(player, id) {
    super(player, id);
    this.x = 550 - this.width / 2;
    this.type = "city";
    this.y = this.id * 40 + 25;
  }
  draw = () => {
    ctx.beginPath();
    if (this.active && !this.inPlay) {
      ctx.fillStyle = "black";
      ctx.arc(
        550,
        this.y + this.height / 2,
        this.width / 2 + 2,
        0,
        2 * Math.PI
      );

      ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = this.colour;
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
  };
}
class Road {
  constructor(player, id) {
    this.colour = player.colour;
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
  draw = () => {
    if (this.active) {
      ctx.fillStyle = "black";
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate((this.direction * Math.PI) / 180);
      ctx.fillRect(
        -this.width / 2 - 2,
        -this.height / 2 - 2,
        this.width + 4,
        this.height + 4
      );
      ctx.rotate((-this.direction * Math.PI) / 180);
      ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
    }
    ctx.fillStyle = this.colour;
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate((this.direction * Math.PI) / 180);
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.rotate((-this.direction * Math.PI) / 180);
    ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
  };
}
module.exports = {
  Settlement: Settlement,
  City: City,
  Road: Road
};
