class Board {
  constructor(boardRadius, hexRadius) {
    this.numbers = [];
    this.colors = [
      "lime",
      "lime",
      "lime",
      "lime",
      "green",
      "green",
      "green",
      "green",
      "gray",
      "gray",
      "gray",
      "yellow",
      "yellow",
      "yellow",
      "yellow",
      "brown",
      "brown",
      "brown",
      "burlywood"
    ];
    this.hexes = [];
    this.ports = [];
    this.boardRadius = boardRadius;
    this.hexRadius = hexRadius;
    this.hexHeight = hexRadius * Math.sqrt(3);
    this.dice = new Dice();
    this.thief = new Thief();
  }
  pushNubers = () => {
    for (let i = 2; i <= 12; i++) {
      this.numbers.push(i);
    }
    for (let i = 3; i <= 11; i++) {
      this.numbers.push(i);
    }
    this.numbers.forEach((number, index) => {
      if (number === 7) {
        this.numbers.splice(index, 1);
      }
    });
  };
  createHexes = () => {
    let grow = 1;
    let currentId = 0;
    let count = this.boardRadius;
    const diagonal = this.boardRadius * 2 - 1;
    for (let i = 1; i <= diagonal; i++) {
      if (i >= this.boardRadius) {
        grow = -1;
      }
      for (let j = 1; j <= count; j++) {
        const color = this.colors.splice(
          Math.floor(Math.random() * this.colors.length),
          1
        );
        if (color[0] === "burlywood") {
          this.thief.x = ((i * 3) / 2) * hexRadius;
          this.thief.y =
            j * this.hexHeight + ((diagonal - count) / 2) * this.hexHeight;
          this.thief.isSet = true;
        }
        const number =
          color[0] !== "burlywood"
            ? this.numbers.splice(
                Math.floor(Math.random() * this.numbers.length),
                1
              )
            : null;
        this.hexes.push(
          new Hex(
            color,
            currentId,
            number,
            [i, j],
            j * this.hexHeight + ((diagonal - count) / 2) * this.hexHeight,
            hexRadius
          )
        );
        currentId++;
      }
      count += grow;
    }
  };
  drawHexes = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 450, 600);
    this.drawPorts();
    this.hexes.forEach(hex => {
      hex.draw();
    });
    if (currentRound > 2) {
      this.dice.draw(diceResult);
    }
  };
  drawPorts = () => {
    this.ports.forEach(port => {
      port.draw();
    });
  };
  createPorts = () => {
    this.hexes.forEach(hex => {
      if (hex.id === 0) {
        this.ports.push(
          new Port(
            (hex.corners[2][0] + hex.corners[3][0]) / 2,
            (hex.corners[2][1] + hex.corners[3][1]) / 2
          )
        );
      } else if (hex.id === 1) {
        this.ports.push(
          new Port(
            (hex.corners[3][0] + hex.corners[4][0]) / 2,
            (hex.corners[3][1] + hex.corners[4][1]) / 2,
            "green"
          )
        );
      } else if (hex.id === 2) {
        this.ports.push(
          new Port(
            (hex.corners[4][0] + hex.corners[5][0]) / 2,
            (hex.corners[4][1] + hex.corners[5][1]) / 2
          )
        );
      } else if (hex.id === 11) {
        this.ports.push(
          new Port(
            (hex.corners[3][0] + hex.corners[4][0]) / 2,
            (hex.corners[3][1] + hex.corners[4][1]) / 2,
            "brown"
          )
        );
      } else if (hex.id === 15) {
        this.ports.push(
          new Port(
            (hex.corners[4][0] + hex.corners[5][0]) / 2,
            (hex.corners[4][1] + hex.corners[5][1]) / 2
          )
        );
      } else if (hex.id === 18) {
        this.ports.push(
          new Port(
            (hex.corners[5][0] + hex.corners[0][0]) / 2,
            (hex.corners[5][1] + hex.corners[0][1]) / 2,
            "gray"
          )
        );
      } else if (hex.id === 16) {
        this.ports.push(
          new Port(
            (hex.corners[1][0] + hex.corners[2][0]) / 2,
            (hex.corners[1][1] + hex.corners[2][1]) / 2,
            "yellow"
          )
        );
      } else if (hex.id === 17) {
        this.ports.push(
          new Port(
            (hex.corners[0][0] + hex.corners[1][0]) / 2,
            (hex.corners[0][1] + hex.corners[1][1]) / 2
          )
        );
      } else if (hex.id === 7) {
        this.ports.push(
          new Port(
            (hex.corners[0][0] + hex.corners[1][0]) / 2,
            (hex.corners[0][1] + hex.corners[1][1]) / 2
          )
        );
      } else if (hex.id === 3) {
        this.ports.push(
          new Port(
            (hex.corners[1][0] + hex.corners[2][0]) / 2,
            (hex.corners[1][1] + hex.corners[2][1]) / 2,
            "lime"
          )
        );
      }
    });
  };
}
