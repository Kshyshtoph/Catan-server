class Port {
  constructor(x, y, type) {
    this.type = type || "3/1";
    this.x = x;
    this.y = y;
    this.radius = 25;
  }
  draw = () => {
    if (this.type === "3/1") {
      ctx.fillStyle = "aqua";
    } else {
      ctx.fillStyle = this.type;
    }
    ctx.beginPath();
    ctx.moveTo(this.x + this.radius, this.y);
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.closePath();
    ctx.stroke();
  };
}
module.exports = {
  Port: Port
};
