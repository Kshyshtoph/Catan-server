class Node {
  constructor(x, y, index) {
    this.visited = false;
    this.index = index;
    this.x = x;
    this.y = y;
    this.previous = -1;
    this.neighbours = [];
  }
}
module.exports = {
  Node
};
