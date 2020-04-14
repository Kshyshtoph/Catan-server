const canvas = document.querySelector("canvas");
const myPlayerInput = document.querySelector("#myPlayer");
const socket = io();
canvas.width = 600;
canvas.height = 600;
const hexRadius = 50;
const ctx = canvas.getContext("2d");
let currentRound = 1;
let myPlayer = 0;
const board = new Board(3, 50);
const players = [new Player("red"), new Player("beige")];
const interface = new Interface(players[0]);
const market = new Market();
const progress = new Progress();
let currentLongestRoad = { playerIndex: null, number: 4 };
let currentHighestKnightPower = { playerIndex: null, number: 2 };
let currentPlayer = players[0];
let diceResult = 0;
socket.addEventListener("globals updated", msg => {
  fetchGlobals();
  interface.draw();
});
socket.addEventListener("progress cards updated", () => fetchProgressCards());
socket.addEventListener("current player updated", () => fetchCurrentPlayer());
socket.addEventListener("market updated", () => fetchMarket());
socket.addEventListener("new move", move => {
  interface.player = players[move.playerIndex];
  switch (move.type) {
    case "settlement build":
      interface.handleSettlementBuild2(move.meeple);
      break;
    case "road build":
      interface.handleRoadBuild2(move.meeple);
      break;
    case "thief setting":
      interface.handleThiefSetting2(move.thiefHex);
      break;
    case "city build":
      interface.handleCityBuild2(move.meeple);
      break;
  }
  interface.player = players[myPlayer];
  interface.draw();
});
socket.addEventListener("resources updated", () => fetchResources());

const sendMarket = () => {
  fetch("/market", {
    method: "PUT",
    body: JSON.stringify(market),
    headers: {
      "Content-Type": "application/json"
    }
  });
};
const fetchMarket = () => {
  fetch("/market")
    .then(res => res.json())
    .then(res => {
      market.active = res.active;
      market.offer = res.offer;
      market.demands = res.demands;
      market.isOfferSet = res.isOfferSet;
      market.tradingPlayerIndex = res.tradingPlayerIndex;
      market.activePlayerIndex = res.activePlayerIndex;
      market.deal = res.deal;
      currentPlayer = players[res.activePlayerIndex];
      interface.player = players[myPlayer];
      interface.draw();
    });
};
const sendThief = steal => {
  fetch("/thief", {
    method: "PUT",
    body: JSON.stringify({ steal }),
    headers: {
      "Content-Type": "application/json"
    }
  });
};
const fetchResources = () => {
  players.forEach((player, playerIndex) => {
    fetch(`/resources/${playerIndex}`)
      .then(res => res.json())
      .then(res => (player.resources = res.resources))
      .then(() => interface.draw());
  });
};
const fetchProgressCards = () => {
  players.forEach((player, playerIndex) => {
    fetch(`/progress/${playerIndex}`)
      .then(res => res.json())
      .then(res => (player.progressCards = res.progressCards))
      .then(() => interface.draw());
  });
};
const fetchBoard = () => {
  fetch("/board")
    .then(res => res.json())
    .then(res => {
      res.hexes.forEach((hex, index) => {
        board.hexes[index] = new Hex(
          [hex.color],
          hex.id,
          [hex.number],
          hex.location,
          hex.y,
          hex.radius
        );
      });
      board.hexes.forEach((hex, hindex) => {
        hex.roadMarkers.forEach((marker, mindex) => {
          marker.active = res.hexes[hindex].roadMarkers[mindex].active;
          marker.taken = res.hexes[hindex].roadMarkers[mindex].taken;
          marker.ocupation = res.hexes[hindex].roadMarkers[mindex].ocupation;
          marker.canBuild = res.hexes[hindex].roadMarkers[mindex].canBuild;
          marker.direction = res.hexes[hindex].roadMarkers[mindex].direction;
        });
      });
      board.hexes.forEach((hex, hindex) => {
        hex.buildingMarkers.forEach((marker, mindex) => {
          marker.active = res.hexes[hindex].buildingMarkers[mindex].active;
          marker.taken = res.hexes[hindex].buildingMarkers[mindex].taken;
          marker.ocupation =
            res.hexes[hindex].buildingMarkers[mindex].ocupation;
          marker.canBuild = res.hexes[hindex].buildingMarkers[mindex].canBuild;
          marker.city = res.hexes[hindex].buildingMarkers[mindex].city;
        });
      });
      res.ports.forEach((port, index) => {
        board.ports[index] = new Port(port.x, port.y, port.type);
      });
      board.thief.x = res.thief.x;
      board.thief.y = res.thief.y;
      board.thief.isSet = res.thief.isSet;
    })
    .then(() => {
      board.drawPorts();
      board.drawHexes();
      board.thief.draw();
      interface.draw();
    });
};
const fetchPlayers = () => {
  fetch("/players")
    .then(res => res.json())
    .then(res => {
      res.players.forEach((player, index) => {
        players[index].meeples.forEach((meeple, index) => {
          meeple.color = player.color;
          meeple.inPlay = player.meeples[index].inPlay;
          meeple.id = player.meeples[index].id;
          meeple.type = player.meeples[index].type;
          meeple.width = player.meeples[index].width;
          meeple.height = player.meeples[index].height;
          meeple.x = player.meeples[index].x;
          meeple.y = player.meeples[index].y;
          if (meeple.type === "road")
            meeple.direction = player.meeples[index].direction;
        });
        players[index].freeSettlement = player.freeSettlement;
        players[index].freeRoads = player.freeRoads;
        players[index].resources = player.resources;
        players[index].progressCards = player.progressCards;
        players[index].victoryPoints = player.victoryPoints;
        players[index].knightsPlayed = player.knightsPlayed;
        players[index].ports = player.ports;
      });
    })
    .then(() => players.forEach(player => player.drawPlayingMeeples()));
};
const fetchGlobals = () => {
  fetch("/globals")
    .then(res => res.json())
    .then(res => {
      diceResult = res.diceResult;
      if (res.currentRound === 2) {
        players[res.activePlayerIndex].freeRoads = 1;
        players[res.activePlayerIndex].freeSettlement = true;
      }
      interface.skipper.activePlayerIndex = res.activePlayerIndex;
      currentPlayer = players[res.activePlayerIndex];
      currentRound = res.currentRound;
      currentHighestKnightPower = res.currentHighestKnightPower;
      currentLongestRoad = res.currentLongestRoad;
      if (diceResult === 7) {
        board.thief.isSet = false;
        board.thief.x = 25;
        board.thief.y = 25;
      } else {
        fetchResources()
      }
      if (res.activePlayerIndex === myPlayer) alert("it's your turn");
      interface.player = players[myPlayer];
      interface.draw();
    });
};
const sendGlobals = () => {
  fetch("/globals", {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      currentRound,
      diceResult,
      activePlayerIndex: interface.skipper.activePlayerIndex,
      currentHighestKnightPower,
      currentLongestRoad
    })
  });
};
const fetchCurrentPlayer = () => {
  fetch("/currentPlayer")
    .then(res => res.json())
    .then(res => {
      currentPlayer = players[res.currentPlayerIndex];
      interface.draw();
    });
};
fetchBoard();
fetchGlobals();
fetchPlayers();

myPlayerInput.addEventListener("change", e => {
  myPlayer = e.target.value - 1;
  players[myPlayer].drawMeeples();
  interface.player = players[myPlayer];
  interface.draw();
});
interface.draw();
canvas.addEventListener("click", interface.handleClick);
