export function DFS(grid, startNode, finishNode) {
    let unVisitedNodes = [];
    let visitedNodes = [];
    startNode.distance = 0;
    console.log("start node: ", [startNode.row, startNode.col], " finishNode", [
      finishNode.row,
      finishNode.col,
    ]);
    unVisitedNodes.push(startNode);
  
    while (unVisitedNodes.length !== 0) {
      if (nextNode === finishNode) return [true, visitedNodes];
  
      console.log("length of unvisited nodes: ", unVisitedNodes.length);
      const nextNode = unVisitedNodes.shift();
      console.log(nextNode.row, nextNode.col);
      if (nextNode.isWall) continue;
      if (!nextNode.isVisited) {
        nextNode.isVisited = true;
        visitedNodes.push(nextNode);
        let { col, row } = nextNode;
        if (row > 0) {
          if (!grid[row - 1][col].isVisited) {
            grid[row - 1][col].previousNode = nextNode;
            unVisitedNodes.push(grid[row - 1][col]);
          }
        }
        if (row < grid.length - 1) {
          if (!grid[row + 1][col].isVisited) {
            grid[row + 1][col].previousNode = nextNode;
            unVisitedNodes.push(grid[row + 1][col]);
          }
        }
        if (col > 0) {
          if (!grid[row][col - 1].isVisited) {
            grid[row][col - 1].previousNode = nextNode;
            unVisitedNodes.push(grid[row][col - 1]);
          }
        }
        if (col < grid[0].length - 1) {
          if (!grid[row][col + 1].isVisited) {
            grid[row][col + 1].previousNode = nextNode;
            unVisitedNodes.push(grid[row][col + 1]);
          }
        }
      }
    }
    return [false, visitedNodes];
  }
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
  