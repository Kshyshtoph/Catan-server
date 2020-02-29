class Market {
  constructor() {
    this.active = false;
    this.offer = [0, 0, 0, 0, 0];
    this.demands = [0, 0, 0, 0, 0];
    this.isOfferSet = false;
    this.tradingPlayerIndex = 0;
    this.activePlayerIndex = 0;
    this.deal = false;
    this.dealwith = "otherPlayer";
  }
  handleTrade = () => {
    for (let i = 0; i < this.offer.length; i++) {
      players[this.activePlayerIndex].resources[i] += this.offer[i];
      players[this.activePlayerIndex].resources[i] -= this.demands[i];
      players[this.tradingPlayerIndex].resources[i] += this.demands[i];
      players[this.tradingPlayerIndex].resources[i] -= this.offer[i];
    }
  };
  handleExchange = () => {
    const suppliesIndexes = [];
    let offeredSuplies = 0,
      demandedSupplies = 0;
    this.offer.forEach((supply, index) => {
      offeredSuplies += supply;
      if (supply !== 0) {
        suppliesIndexes.push(index);
      }
    });
    this.demands.forEach(demand => {
      demandedSupplies += demand;
    });
    if (
      offeredSuplies === 4 * demandedSupplies &&
      suppliesIndexes.length === 1
    ) {
      players[this.tradingPlayerIndex].resources.forEach((resource, index) => {
        players[this.tradingPlayerIndex].resources[index] += this.demands[
          index
        ];
        players[this.tradingPlayerIndex].resources[index] -= this.offer[index];
      });
    } else if (
      offeredSuplies === 3 * demandedSupplies &&
      suppliesIndexes.length === 1 &&
      players[this.tradingPlayerIndex].ports.findIndex(
        port => port.type === "3/1"
      ) !== -1
    ) {
      players[this.tradingPlayerIndex].resources.forEach((resource, index) => {
        players[this.tradingPlayerIndex].resources[index] += this.demands[
          index
        ];
        players[this.tradingPlayerIndex].resources[index] -= this.offer[index];
      });
    } else if (
      offeredSuplies === 2 * demandedSupplies &&
      suppliesIndexes.length === 1
    ) {
      switch (suppliesIndexes[0]) {
        case 0:
          if (
            players[this.tradingPlayerIndex].ports.findIndex(
              port => port.type === "green"
            ) !== -1
          ) {
            players[this.tradingPlayerIndex].resources.forEach(
              (resource, index) => {
                players[this.tradingPlayerIndex].resources[
                  index
                ] += this.demands[index];
                players[this.tradingPlayerIndex].resources[index] -= this.offer[
                  index
                ];
              }
            );
          }
          break;
        case 1:
          if (
            players[this.tradingPlayerIndex].ports.findIndex(
              port => port.type === "lime"
            ) !== -1
          ) {
            players[this.tradingPlayerIndex].resources.forEach(
              (resource, index) => {
                players[this.tradingPlayerIndex].resources[
                  index
                ] += this.demands[index];
                players[this.tradingPlayerIndex].resources[index] -= this.offer[
                  index
                ];
              }
            );
          }
          break;
        case 2:
          if (
            players[this.tradingPlayerIndex].ports.findIndex(
              port => port.type === "brown"
            ) !== -1
          ) {
            players[this.tradingPlayerIndex].resources.forEach(
              (resource, index) => {
                players[this.tradingPlayerIndex].resources[
                  index
                ] += this.demands[index];
                players[this.tradingPlayerIndex].resources[index] -= this.offer[
                  index
                ];
              }
            );
          }
          break;
        case 3:
          if (
            players[this.tradingPlayerIndex].ports.findIndex(
              port => port.type === "gray"
            ) !== -1
          ) {
            players[this.tradingPlayerIndex].resources.forEach(
              (resource, index) => {
                players[this.tradingPlayerIndex].resources[
                  index
                ] += this.demands[index];
                players[this.tradingPlayerIndex].resources[index] -= this.offer[
                  index
                ];
              }
            );
          }
          break;
        case 4:
          if (
            players[this.tradingPlayerIndex].ports.findIndex(
              port => port.type === "yellow"
            ) !== -1
          ) {
            players[this.tradingPlayerIndex].resources.forEach(
              (resource, index) => {
                players[this.tradingPlayerIndex].resources[
                  index
                ] += this.demands[index];
                players[this.tradingPlayerIndex].resources[index] -= this.offer[
                  index
                ];
              }
            );
          }
          break;
      }
    }
  };
  closePopup = () => {
    this.active = false;
    this.deal = false;
    this.isOfferSet = false;
    this.offer = [0, 0, 0, 0, 0];
    this.demands = [0, 0, 0, 0, 0];
    this.dealWith = "otherPlayer";
    currentPlayer = players[this.tradingPlayerIndex];
  };
}
module.exports = {
  Market
};
