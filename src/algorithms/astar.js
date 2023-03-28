/*
The moves performed are only limited to top, down, left and right. Will update soon for diagonal movement as well.
*/
export function astar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];  // Array to store visited nodes
    startNode.distance = 0; // Setting the startNode distance to 0
    startNode.cost = 0;
    const unvisitedNodes = getAllNodes(grid); // Obtain all the nodes in the grid (Includes wall nodes, start and end nodes)
    while (!!unvisitedNodes.length) {
      
      sortNodesByDistance(unvisitedNodes, finishNode); // Sorts the nodes based on distance
      const closestNode = unvisitedNodes.shift(); // Obtains the closest node
      console.log(closestNode)
      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;
      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
      // i.e solution is not found
      if (closestNode.distance === Infinity) 
      return [false, visitedNodesInOrder];
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      if (closestNode === finishNode) 
      return [true, visitedNodesInOrder]; // Solution is found
      updateUnvisitedNeighbors(closestNode, grid, finishNode);
    }
  }
  
  function sortNodesByDistance(unvisitedNodes, finishNode) {
    // Sorts two nodes based on comparison of distances
    unvisitedNodes.sort((nodeA, nodeB) => {
      return  nodeA.cost - nodeB.cost
    });
  }
  
  function updateUnvisitedNeighbors(node, grid, finishNode) {
    // Updates the neighbors and appends parents
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      let heuristic = Math.abs((neighbor.row - finishNode.row)) + Math.abs ((neighbor.col - finishNode.col))
      let total_cost = heuristic + node.distance + 1;
      neighbor.distance = node.distance + 1;
     // let total_cost = heuristic + node.distance + 1;
      neighbor.previousNode = node;
      neighbor.cost = total_cost
    }
  }
  
  function getUnvisitedNeighbors(node, grid) {
    // Obtains the next neighbors based on moves
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  
  function getAllNodes(grid) {
    const nodes = []; 
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
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