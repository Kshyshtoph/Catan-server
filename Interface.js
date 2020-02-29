const Skipper = require("./Skipper").Skipper;

class Interface {
  constructor(player, board) {
    this.player = player;
    this.board = board;
  }

  handleSettlementBuild = moveMeeple => {
    const activeMeeple = this.player.meeples.find(
      meeple => meeple.type === "settlement" && meeple.id === moveMeeple.id
    );
    activeMeeple.x = moveMeeple.x;
    activeMeeple.y = moveMeeple.y;
    let settlementBuilt = false;
    this.board.hexes.forEach(hex => {
      hex.buildingMarkers.forEach(marker => {
        const { x, y, width, height } = marker;
        if (
          activeMeeple.x + activeMeeple.height / 2 === x &&
          activeMeeple.y + activeMeeple.height / 2 === y
        ) {
          marker.taken = true;
          settlementBuilt = true;
          marker.ocupation = this.player.colour;
          this.board.hexes.forEach(hex => {
            hex.buildingMarkers.forEach(m => {
              if (
                m.x > marker.x - 50 - 5 &&
                m.x < marker.x + 50 + 5 &&
                m.y > marker.y - 50 - 5 &&
                m.y < marker.y + 50 + 5
              ) {
                m.taken = true;
              }
              if (m.x === marker.x && m.y === marker.y) {
                m.ocupation = this.player.colour;
              }
            });
            hex.roadMarkers.forEach(m => {
              if (
                m.x > marker.x - 50 &&
                m.x < marker.x + 50 &&
                m.y > marker.y - 50 &&
                m.y < marker.y + 50
              ) {
                m.canBuild.push(this.player.colour);
              }
            });
          });
        }
      });
    });
    if (settlementBuilt) {
      this.player.victoryPoints++;
      activeMeeple.inPlay = true;
      if (!this.player.freeSettlement) {
        this.player.resources[0] -= 1;
        this.player.resources[1] -= 1;
        this.player.resources[2] -= 1;
        this.player.resources[4] -= 1;
      }
      this.player.freeSettlement = false;
    }
    this.board.ports.forEach(port => {
      if (
        activeMeeple.x + activeMeeple.width / 2 <= port.x + port.radius &&
        activeMeeple.x + activeMeeple.width / 2 >= port.x - port.radius &&
        activeMeeple.y + activeMeeple.height / 2 >= port.y - port.radius &&
        activeMeeple.y + activeMeeple.height / 2 <= port.y + port.radius
      ) {
        this.player.ports.push(port);
      }
    });
  };

  handleRoadBuild = moveMeeple => {
    let roadBuilt = false;
    const activeMeeple = this.player.meeples.find(
      meeple => meeple.id === moveMeeple.id && meeple.type === "road"
    );
    activeMeeple.x = moveMeeple.x;
    activeMeeple.y = moveMeeple.y;
    this.board.hexes.forEach(hex => {
      hex.roadMarkers.forEach(marker => {
        const { x, y, width, height } = marker;
        if (
          activeMeeple.x + activeMeeple.width / 2 === x &&
          activeMeeple.y + activeMeeple.height / 2 === y
        ) {
          activeMeeple.inPlay = true;
          activeMeeple.active = false;
          activeMeeple.direction = marker.direction;
          marker.taken = true;
          roadBuilt = true;
          marker.ocupation = this.player.colour;
          this.board.hexes.forEach(hex => {
            hex.roadMarkers.forEach(m => {
              if (
                m.x > marker.x - hexRadius - 5 &&
                m.x < marker.x + hexRadius + 5 &&
                m.y > marker.y - hexRadius - 5 &&
                m.y < marker.y + hexRadius + 5
              ) {
                m.active = true;
                m.canBuild.push(this.player.colour);
                activeMeeple.neighbours.push(m);
              }
            });
            hex.buildingMarkers.forEach(m => {
              if (
                m.x > marker.x - hexRadius &&
                m.x < marker.x + hexRadius &&
                m.y > marker.y - hexRadius &&
                m.y < marker.y + hexRadius
              )
                m.canBuild.push(this.player.colour);
            });
          });
        }
      });
    });
    if (this.player.freeRoads === 0 && roadBuilt) {
      this.player.resources[0] -= 1;
      this.player.resources[2] -= 1;
    }
    if (roadBuilt && this.player.freeRoads !== 0) {
      this.player.freeRoads -= 1;
    }
    this.player.findLongestRoad();
  };
  handleCityBuild = moveMeeple => {
    let cityBuilt = true;
    const activeMeeple = this.player.meeples.find(
      meeple => meeple.type === "city" && meeple.id === moveMeeple.id
    );
    activeMeeple.x = moveMeeple.x;
    activeMeeple.y = moveMeeple.y;
    this.player.meeples.forEach(meeple => {
      if (meeple.type === "settlement" && meeple.inPlay) {
        if (meeple.x === activeMeeple.x && meeple.y === activeMeeple.y) {
          meeple.x = meeple.initialX;
          meeple.y = meeple.initialY;
          cityBuilt = true;
          meeple.inPlay = false;
          activeMeeple.active = false;
          activeMeeple.inPlay = true;
        }
        board.hexes.forEach(hex => {
          hex.buildingMarkers.forEach(marker => {
            if (
              marker.x === activeMeeple.x + activeMeeple.width / 2 &&
              marker.y === activeMeeple.y + activeMeeple.height / 2
            ) {
              marker.city = true;
            }
          });
        });
      }
    });
    if (cityBuilt) {
      this.player.resources[3] -= 3;
      this.player.resources[4] -= 2;
      this.player.victoryPoints += 1;
      console.log(this.player.resources);
    }
  };
}
module.exports = { Interface };
