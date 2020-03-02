const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const http = require("http").createServer(app);
global.io = require("socket.io")(http);
const Board = require("./Board").Board;
const Player = require("./Player").Player;
const Market = require("./Market").Market;
const Progress = require("./Progress").Progress;
const Interface = require("./Interface").Interface;
const CircularJSON = require("circular-json");
const port = 3000;
global.market = new Market();
global.board = new Board(3, 50);
board.pushNubers();
board.createHexes();
board.createPorts();
global.hexRadius = 50;
global.currentLongestRoad = { playerIndex: null, number: 4 };
global.currentHighestKnightPower = { playerIndex: null, number: 2 };
global.players = [new Player("red"), new Player("beige")];
global.currentRound = 1;
global.diceResult = 0;
global.activePlayerIndex = 0;
global.progress = new Progress();
global.currentPlayer = players[activePlayerIndex];
const interface = new Interface(players[activePlayerIndex], board);
let move = {};
// app.configure(function() {
//   app.use(app.router);
// });
app.use(express.json({ limit: "5mb" }));
app.use(express.static("client"));
// app.use(bodyParser.json());

fs.writeFileSync("./JSON/board.json", JSON.stringify(board));
fs.writeFileSync("./JSON/players.json", JSON.stringify({ players }));
fs.writeFileSync("./JSON/market.json", JSON.stringify(market));
fs.writeFileSync("./JSON/move.json", "");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "client.html"));
});
app.get("/board", (req, res) => {
  res.send(CircularJSON.stringify(board));
});
app.put("/card", (req, res) => {
  progress.handleCardPlay(req.body.card, req.body.i);
  res.send("ok");
});
app.get("/monopoly/:i", (req, res) => {
  res.send("ok");
  progress.handleMonopoly(req.params.i);
});
app.get("/invention/:i", (req, res) => {
  res.send("ok");
  progress.handleInvention(req.params.i);
});
app.put("/progress", (req, res) => {
  players[req.body.playerIndex].progressCards.push({
    type: progress.generateCard(),
    age: currentRound
  });
  players[req.body.playerIndex].resources[1] -= 1;
  players[req.body.playerIndex].resources[3] -= 1;
  players[req.body.playerIndex].resources[4] -= 1;
  io.emit("resources updated");
  res.send(
    JSON.stringify({
      progressCards: players[req.body.playerIndex].progressCards
    })
  );
});
app.get("/move", (req, res) => {
  res.sendFile(path.join(__dirname, "JSON", "move.json"));
});
app.get("/players", (req, res) => {
  res.send(CircularJSON.stringify({ players }));
});
app.get("/globals", (req, res) => {
  res.send(
    CircularJSON.stringify({
      currentRound,
      diceResult,
      activePlayerIndex,
      currentHighestKnightPower,
      currentLongestRoad
    })
  );
});
app.put("/globals", (req, res) => {
  if (req.body.currentRound === 2) {
    players[req.body.activePlayerIndex].freeSettlement = true;
    players[req.body.activePlayerIndex].freeRoads = 1;
  }
  currentRound = req.body.currentRound;
  diceResult = req.body.diceResult;
  activePlayerIndex = req.body.activePlayerIndex;
  currentHighestKnightPower = req.body.currentHighestKnightPower;
  currentLongestRoad = req.body.currentLongestRoad;
  res.send("globals updated");
  io.emit("globals updated");
  board.hexes.forEach(hex => hex.payResources());
  fs.writeFileSync("./JSON/globals.json", JSON.stringify(req.body));
  if (diceResult === 7) {
    board.thief.isSet = false;
  }
});
app.put("/thief", (req, res) => {
  board.thief.handleStealing(req.body.steal);
  res.send("ok");
  io.emit("resources updated");
});
app.get("/currentPlayer", (req, res) => {
  const currentPlayerIndex = players.findIndex(
    player => player === players[activePlayerIndex]
  );
  res.send(JSON.stringify({ currentPlayerIndex }));
});
app.put("/market", (req, res) => {
  market.active = req.body.active;
  market.offer = req.body.offer;
  market.demands = req.body.demands;
  market.isOfferSet = req.body.isOfferSet;
  market.tradingPlayerIndex = req.body.tradingPlayerIndex;
  market.activePlayerIndex = req.body.activePlayerIndex;
  market.deal = req.body.deal;
  market.dealWith = req.body.dealWith;
  res.send("ok");
  io.emit("market updated");
  if (market.deal && market.dealWith === "otherPlayer") {
    market.handleTrade();
    market.closePopup();
    io.emit("current player updated");
    io.emit("resources updated");
  }
  if (market.deal && market.dealWith === "bank") {
    market.handleExchange();
    market.closePopup();
    io.emit("resources updated");
  }
});
app.get("/resources/:index", (req, res) => {
  res.send(JSON.stringify({ resources: players[req.params.index].resources }));
});
app.get("/progress/:index", (req, res) => {
  res.send(
    JSON.stringify({ progressCards: players[req.params.index].progressCards })
  );
});
app.get("/market", (req, res) => {
  res.send(JSON.stringify(market));
});
app.post("/move", (req, res) => {
  fs.writeFileSync("./JSON/move.json", JSON.stringify(req.body));
  move = req.body;
  res.send("move saved");
  io.emit("new move", move);
  interface.player = players[move.playerIndex];
  switch (move.type) {
    case "settlement build":
      interface.handleSettlementBuild(move.meeple);
      io.emit("resources updated");
      break;
    case "road build":
      interface.handleRoadBuild(move.meeple);
      io.emit("resources updated");
      break;
    case "thief setting":
      board.thief.isSet = true;
      board.thief.x = move.thiefHex.x;
      board.thief.y = move.thiefHex.y;
      break;
    case "city build":
      interface.handleCityBuild(move.meeple);
      io.emit("resources updated");
      break;
  }
});

http.listen(port, "0.0.0.0", () => {
  console.log("server is listening at port 3000");
});
