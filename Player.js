const Settlement = require("./Meeples").Settlement;
const City = require("./Meeples").City;
const Road = require("./Meeples").Road;
const Node = require("./Node").Node;
class Player {
  constructor(colour) {
    this.colour = colour;
    this.meeples = [];
    this.freeSettlement = true;
    this.freeRoads = 1;
    this.pushMeeples();
    this.pushRoads();
    this.resources = [0, 0, 0, 0, 0];
    this.progressCards = [];
    this.victoryPoints = 0;
    this.freeResources = 0;
    this.knightsPlayed = 0;
    this.ports = [];
  }
  pushRoads = () => {
    for (let i = 0; i < 15; i++) {
      this.meeples.push(new Road(this, i));
    }
  };
  pushMeeples = () => {
    for (let i = 0; i < 5; i++) {
      this.meeples.push(new Settlement(this, i));
    }
    for (let i = 0; i < 4; i++) {
      this.meeples.push(new City(this, i));
    }
  };
  drawMeeples = () => {
    this.meeples.forEach(meeple => {
      meeple.draw();
    });
  };
  drawPlayingMeeples = () => {
    this.meeples.forEach(meeple => {
      if (meeple.inPlay) {
        meeple.draw();
      }
    });
  };
  drawResources() {
    ctx.font = "30px Arial";
    ctx.strokeStyle = "black";
    const colours = ["green", "lime", "brown", "gray", "yellow"];
    colours.forEach((colour, i) => {
      ctx.fillStyle = colour;
      ctx.fillRect(i * 60 + 10, 500, 50, 75);
      ctx.strokeRect(i * 60 + 10, 500, 50, 75);
      ctx.fillStyle = "black";
      ctx.fillText(this.resources[i], i * 60 + 30, 560);
    });
  }
  canAffordSettlement = () => {
    if (
      this.resources[0] >= 1 &&
      this.resources[2] >= 1 &&
      this.resources[1] >= 1 &&
      this.resources[4] >= 1
    )
      return true;
    else return false;
  };
  canAffordRoad = () => {
    if (this.resources[0] >= 1 && this.resources[2] >= 1) return true;
    else return false;
  };
  canAffordCity = () => {
    if (this.resources[3] >= 3 && this.resources[4] >= 2) {
      return true;
    } else return false;
  };
  canAffordProgressCard = () => {
    if (this.resources[1] > 0 && this.resources[3] > 0 && this.resources[4] > 0)
      return true;
    else return false;
  };
  drawVictoryPoints = () => {
    let sum = this.victoryPoints;
    if (currentLongestRoad.player === this) {
      sum += 2;
    }
    if (currentHighestKnightPower.player === this) {
      sum += 2;
    }
    ctx.fillStyle = "white";
    ctx.fillRect(370, 0, 30, 30);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(sum, 400, 30);
  };
  findLongestRoad = () => {
    let longest = 0;
    const roadsInPlay = [];
    const map = [];
    this.meeples.forEach(meeple => {
      if (meeple.type === "road" && meeple.inPlay === true) {
        roadsInPlay.push(meeple);
      }
    });
    roadsInPlay.forEach(road => {
      road.node = new Node(road.x, road.y);
    });
    for (let i = 0; i < roadsInPlay.length; i++) {
      const node = new Node(roadsInPlay[i].x, roadsInPlay[i].y, i);
      map.push(node);
      roadsInPlay[i].node = node;
    }
    for (let i = 0; i < roadsInPlay.length; i++) {
      map.forEach(node => {
        if (
          roadsInPlay[i].x <= node.x + hexRadius &&
          roadsInPlay[i].x >= node.x - hexRadius &&
          roadsInPlay[i].y <= node.y + hexRadius &&
          roadsInPlay[i].y >= node.y - hexRadius &&
          !(roadsInPlay[i].x === node.x && roadsInPlay[i].y === node.y)
        ) {
          node.neighbours.push(roadsInPlay[i].node);
          node.longestPath = 1;
        }
      });
    }
    const visitNeighbours = (mainNode, previousNode, node, distance) => {
      if (!mainNode.visitedNodes.includes(node)) {
        mainNode.visitedNodes.push(node);
        distance++;
        if (distance > mainNode.longestPath) {
          mainNode.longestPath = distance;
        }
        node.neighbours.forEach(neighbour => {
          if (!previousNode.neighbours.includes(neighbour))
            visitNeighbours(mainNode, node, neighbour, distance);
        });
      }
    };
    map.forEach(node => {
      node.visitedNodes = [node];
      node.neighbours.forEach(neighbour => {
        visitNeighbours(node, node, neighbour, 1);
      });
      if (node.longestPath > longest) {
        longest = node.longestPath;
      }
    });
    if (map.length === 1) {
      return 1;
    }
    if (currentLongestRoad.number < longest) {
      currentLongestRoad.number = longest;
      currentLongestRoad.playerIndex = players.findIndex(
        player => player === this
      );
    }
    return longest;
  };
  drawLongestRoad = () => {
    const longest = this.findLongestRoad();
    ctx.font = "30px Arial";
    ctx.fillText(longest, 30, 470);
    if (currentLongestRoad.player === this) {
      ctx.drawImage(this.crown, 25, 420);
    }
  };
  drawKnightsPlayed = () => {
    if (this.knightsPlayed > currentHighestKnightPower.number) {
      currentHighestKnightPower.number = this.knightsPlayed;
      currentHighestKnightPower.player = this;
    }
    ctx.font = "30px Arial";
    ctx.fillText(this.knightsPlayed, 60, 470);
    if (currentHighestKnightPower.player === this) {
      ctx.drawImage(this.crown, 55, 420);
    }
  };
}
module.exports = { Player: Player };
