class Interface {
  constructor(player) {
    this.player = player;
    this.skipper = new Skipper(players);
  }
  draw = () => {
    if (
      this.player.meeples.findIndex(
        meeple => meeple.active === true && meeple.type === "settlement"
      ) !== -1
    ) {
      board.hexes.forEach(hex => {
        hex.drawBuildingMarkers();
      });
    } else if (
      this.player.meeples.findIndex(
        meeple => meeple.active === true && meeple.type === "road"
      ) !== -1
    ) {
      board.hexes.forEach(hex => hex.drawRoadMarkers());
    } else {
      board.drawHexes();
    }
    players.forEach(player => player.drawPlayingMeeples());
    ctx.fillStyle = "burlywood";
    ctx.fillRect(450, 0, 150, 600);
    players[myPlayer].drawMeeples();
    players[myPlayer].drawResources();
    this.skipper.draw();
    market.draw();
    progress.draw();
    players[myPlayer].drawVictoryPoints();
    players[myPlayer].drawLongestRoad();
    players[myPlayer].drawKnightsPlayed();
    board.thief.draw();
    if (market.active) {
      market.drawPopup();
    }
    if (board.thief.active) {
      board.thief.drawPlayersPopup();
    }
    if (progress.active) {
      progress.drawPopup();
    }
    if (progress.monopolyPopupActive) {
      progress.drawMonopolyPopup();
    }
    if (progress.inventionPopupActive) {
      progress.drawMonopolyPopup();
    }
    this.drawCurrentPlayer();
  };
  handleClick = e => {
    if (
      currentPlayer.colour === players[myPlayer].colour ||
      (market.activePlayerIndex === myPlayer && market.active)
    ) {
      if (
        !market.active &&
        !board.thief.active &&
        !progress.active &&
        !progress.monopolyPopupActive &&
        !progress.inventionPopupActive
      ) {
        this.handleSettlementBuild(e);
        this.handleRoadBuild(e);
        this.handleCityBuild(e);
        this.handlePopupShow(e);
        this.handleMeepleSelect(e);
        this.handleThiefSetting(e);
        this.handleSkipping(e);
      } else if (market.active) {
        market.handlePopup(e);
      } else if (board.thief.active) {
        board.thief.handlePlayersPopup(e);
      } else if (progress.active) {
        progress.handlePopup(e);
      } else if (progress.monopolyPopupActive) {
        progress.handleMonopolyPopup(e);
      } else {
        progress.handleInventionPopup(e);
      }
    }

    this.draw();
  };
  handleSettlementBuild = e => {
    if (
      this.player.meeples.findIndex(
        meeple => meeple.active === true && meeple.type === "settlement"
      ) !== -1
    ) {
      const activeMeeple = this.player.meeples[
        this.player.meeples.findIndex(meeple => meeple.active === true)
      ];
      let settlementBuilt = false;
      board.hexes.forEach(hex => {
        hex.buildingMarkers.forEach(marker => {
          const { x, y, width, height } = marker;
          if (
            e.offsetX > x - width / 2 &&
            e.offsetX < x + width / 2 &&
            e.offsetY > y - height / 2 &&
            e.offsetY < y + height / 2 &&
            !marker.taken &&
            (this.player.freeSettlement || this.player.canAffordSettlement())
          ) {
            activeMeeple.x = x - activeMeeple.height / 2;
            activeMeeple.y = y - activeMeeple.width / 2;
            activeMeeple.inPlay = true;
            activeMeeple.active = false;
            marker.taken = true;
            settlementBuilt = true;
            marker.ocupation = currentPlayer.colour;
            if (!this.player.freeSettlement) {
              this.player.resources[0] -= 1;
              this.player.resources[2] -= 1;
              this.player.resources[4] -= 1;
              this.player.resources[1] -= 1;
            }
            this.player.freeSettlement = false;
            board.hexes.forEach(hex => {
              hex.buildingMarkers.forEach(m => {
                if (m.x === marker.x && m.y === marker.y) {
                  m.ocupation = currentPlayer.colour;
                }
                if (
                  m.x > marker.x - 50 - 5 &&
                  m.x < marker.x + 50 + 5 &&
                  m.y > marker.y - 50 - 5 &&
                  m.y < marker.y + 50 + 5
                ) {
                  m.taken = true;
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
        fetch("/move", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            type: "settlement build",
            meeple: activeMeeple,
            playerIndex: players.findIndex(player => player === this.player)
          })
        });
      }
      board.ports.forEach(port => {
        if (
          activeMeeple.x + activeMeeple.width / 2 <= port.x + port.radius &&
          activeMeeple.x + activeMeeple.width / 2 >= port.x - port.radius &&
          activeMeeple.y + activeMeeple.height / 2 >= port.y - port.radius &&
          activeMeeple.y + activeMeeple.height / 2 <= port.y + port.radius
        ) {
          this.player.ports.push(port);
        }
      });
    }
  };
  handleRoadBuild = e => {
    let roadBuilt = false;
    if (
      this.player.meeples.findIndex(
        meeple => meeple.active === true && meeple.type === "road"
      ) !== -1 &&
      (this.player.freeRoads || this.player.canAffordRoad())
    ) {
      const activeMeeple = this.player.meeples[
        this.player.meeples.findIndex(meeple => meeple.active === true)
      ];

      board.hexes.forEach(hex => {
        hex.roadMarkers.forEach(marker => {
          const { x, y, width, height } = marker;
          if (
            e.offsetX > x - width / 2 &&
            e.offsetX < x + width / 2 &&
            e.offsetY > y - height / 2 &&
            e.offsetY < y + height / 2 &&
            !marker.taken &&
            marker.canBuild.includes(this.player.colour)
          ) {
            activeMeeple.x = x - activeMeeple.width / 2;
            activeMeeple.y = y - activeMeeple.height / 2;
            activeMeeple.inPlay = true;
            activeMeeple.active = false;
            activeMeeple.direction = marker.direction;
            marker.taken = true;
            marker.ocupation = this.player.colour;
            roadBuilt = true;
            board.hexes.forEach(hex => {
              hex.roadMarkers.forEach(m => {
                if (
                  m.x > marker.x - 50 - 5 &&
                  m.x < marker.x + 50 + 5 &&
                  m.y > marker.y - 50 - 5 &&
                  m.y < marker.y + 50 + 5
                ) {
                  m.active = true;
                  m.canBuild.push(this.player.colour);
                }
              });
              hex.buildingMarkers.forEach(m => {
                if (
                  m.x > marker.x - 50 &&
                  m.x < marker.x + 50 &&
                  m.y > marker.y - 50 &&
                  m.y < marker.y + 50
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
      fetch("/move", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: CircularJSON.stringify({
          type: "road build",
          meeple: activeMeeple,
          playerIndex: players.findIndex(player => player === this.player)
        })
      });
    }
  };
  handleCityBuild = e => {
    let cityBuilt = false;
    if (
      this.player.meeples.findIndex(
        meeple => meeple.active === true && meeple.type === "city"
      ) !== -1 &&
      this.player.canAffordCity()
    ) {
      const activeMeeple = this.player.meeples[
        this.player.meeples.findIndex(
          meeple => meeple.active === true && meeple.type === "city"
        )
      ];

      this.player.meeples.forEach(meeple => {
        if (meeple.type === "settlement" && meeple.inPlay) {
          if (
            e.offsetX > meeple.x &&
            e.offsetX < meeple.x + meeple.width &&
            e.offsetY > meeple.y &&
            e.offsetY < meeple.y + meeple.height
          ) {
            activeMeeple.x = meeple.x;
            activeMeeple.y = meeple.y;
            meeple.x = meeple.initialX;
            cityBuilt = true;
            meeple.y = meeple.initialY;
            meeple.inPlay = false;
            activeMeeple.active = false;
            activeMeeple.inPlay = true;
          }
          board.hexes.forEach(hex => {
            hex.buildingMarkers.forEach(marker => {
              if (marker.x === activeMeeple.x && marker.y === activeMeeple.y) {
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
        fetch("/move", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: CircularJSON.stringify({
            type: "city build",
            meeple: activeMeeple,
            playerIndex: players.findIndex(player => player === this.player)
          })
        });
      }
    }
  };
  handleMeepleSelect = e => {
    this.player.meeples.forEach(meeple => {
      if (!meeple.inPlay) {
        const { x, y, width, height } = meeple;
        meeple.active = false;
        if (
          e.offsetX > x &&
          e.offsetX < x + width &&
          e.offsetY > y &&
          e.offsetY < y + height
        ) {
          meeple.active = true;
        }
      }
    });
  };
  handlePopupShow = e => {
    if (
      e.offsetX > market.x &&
      e.offsetX < market.x + market.width &&
      e.offsetY > market.y &&
      e.offsetY < market.y + market.height
    ) {
      market.activePlayerIndex = players.findIndex(
        player => player === currentPlayer
      );
      market.active = true;
      market.isOfferSet = false;
      sendMarket();
    }
    if (
      e.offsetX > progress.x &&
      e.offsetX < progress.x + progress.width &&
      e.offsetY > progress.y &&
      e.offsetY < progress.y + progress.height
    ) {
      progress.active = true;
    }
  };
  handleSkipping = e => {
    if (
      e.offsetX > this.skipper.x &&
      e.offsetX < this.skipper.x + this.skipper.width &&
      e.offsetY > this.skipper.y &&
      e.offsetY < this.skipper.y + this.skipper.height
    ) {
      this.skipper.skip();
      this.player = players[this.skipper.activePlayerIndex];
    }
  };
  handleThiefSetting = e => {
    if (!board.thief.isSet) {
      let nearest = 300;
      let thiefHex;
      board.hexes.forEach(hex => {
        const distance = Math.sqrt(
          Math.pow(e.offsetX - hex.x, 2) + Math.pow(e.offsetY - hex.y, 2)
        );
        if (distance < nearest) {
          nearest = distance;
          board.thief.x = hex.x;
          board.thief.y = hex.y;
          board.thief.isSet = true;
          thiefHex = hex;
        }
      });
      thiefHex.buildingMarkers.forEach(marker => {
        if (
          marker.ocupation &&
          !board.thief.stealFrom.includes(marker.ocupation) &&
          marker.ocupation !== this.player.colour
        ) {
          board.thief.stealFrom.push(marker.ocupation);
        }
      });
      if (board.thief.stealFrom !== []) board.thief.active = true;
      fetch("/move", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          type: "thief setting",
          thiefHex
        })
      });
    }
  };
  drawCurrentPlayer = () => {
    ctx.fillStyle = "black";
    ctx.font = "30px arial";
    ctx.fillText("current player: " + currentPlayer.colour, 100, 30);
  };
  handleSettlementBuild2 = moveMeeple => {
    const activeMeeple = this.player.meeples.find(
      meeple => meeple.type === "settlement" && meeple.id === moveMeeple.id
    );
    activeMeeple.x = moveMeeple.x;
    activeMeeple.y = moveMeeple.y;
    let settlementBuilt = false;
    board.hexes.forEach(hex => {
      hex.buildingMarkers.forEach(marker => {
        const { x, y, width, height } = marker;
        if (
          activeMeeple.x + activeMeeple.height / 2 === x &&
          activeMeeple.y + activeMeeple.height / 2 === y
        ) {
          marker.taken = true;
          settlementBuilt = true;
          marker.ocupation = this.player.colour;
          board.hexes.forEach(hex => {
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
      activeMeeple.inPlay = true;
    }
  };
  handleRoadBuild2 = moveMeeple => {
    let roadBuilt = false;
    const activeMeeple = this.player.meeples.find(
      meeple => meeple.id === moveMeeple.id && meeple.type === "road"
    );
    activeMeeple.x = moveMeeple.x;
    activeMeeple.y = moveMeeple.y;
    board.hexes.forEach(hex => {
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
          board.hexes.forEach(hex => {
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
    this.player.findLongestRoad();
  };
  handleThiefSetting2 = thiefHex => {
    board.thief.x = thiefHex.x;
    board.thief.y = thiefHex.y;
    board.thief.isSet = true;
  };
  handleCityBuild2 = moveMeeple => {
    let cityBuilt = false;
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
              marker.y === activeMeeple.y + activeMeeple.width / 2
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
    }
  };
}
