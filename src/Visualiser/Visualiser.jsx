import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Node from "./Node/Node";
import Dropdown from "react-bootstrap/Dropdown";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { BFS } from "../algorithms/bfs";
import { DFS } from "../algorithms/dfs";
import { astar } from "../algorithms/astar";

import "./Visualiser.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      algo: "",
      START_NODE_ROW: "",
      START_NODE_COL: "",
      FINISH_NODE_ROW: "",
      FINISH_NODE_COL: "",
      startNode: null,
      endNode: null,
      show: "",
    };
    this.setStartNode = this.setStartNode.bind(this);
    this.setEndNode = this.setEndNode.bind(this);
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid, show: true });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.startNode != prevState.startNode) {
      let grid = this.getInitialGrid();
      this.setState({ grid: grid });
    }
    if(this.state.endNode!=prevState.endNode) {
      let grid = this.getInitialGrid();
      this.setState({grid:grid})
    }
  }

  createNode = (col, row) => {
    return {
      col,
      row,
      isStart:
        row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL,
      isFinish:
        row === this.state.FINISH_NODE_ROW &&
        col === this.state.FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        let currNode = this.createNode(col, row);
        currentRow.push(currNode);
      }
      grid.push(currentRow);
    }
    return grid;
  };

  getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice(); // copies the grid
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: true,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  resetMap = () => {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  };

  handleMouseDown(row, col) {
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  setStartNode(row, col) {
    console.log("start node", row, col);
    this.setState({
      START_NODE_ROW: row,
      START_NODE_COL: col,
      startNode: true,
    });
  }
  setEndNode(row, col) {
    console.log("end node", row, col);
    this.setState({
      FINISH_NODE_ROW: row,
      FINISH_NODE_COL: col,
      endNode: true,
    });
  }
  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualize() {
    const { grid } = this.state;
    console.log("grid", grid);
    const startNode =
      grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode =
      grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
    console.log("visualiser", startNode, finishNode);
    let visitedNodesInOrder = "";
    switch (this.state.algo) {
      case "BFS": {
        visitedNodesInOrder = BFS(grid, startNode, finishNode);
        break;
      }
      case "DFS": {
        visitedNodesInOrder = DFS(grid, startNode, finishNode);
        break;
      }
      case "Dijkstra": {
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        break;
      }
      case "AStar": {
        visitedNodesInOrder = astar(grid, startNode, finishNode);
        break;
      }
      default: {
        console.log("The algorithm hasn't been selected");
      }
    }

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <Container fluid>
          <Modal
            show={this.state.show}
            onHide={() => this.setState({ show: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title>Start and End Goals</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Click on the grid to set the Start and End Goals
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => this.setState({ show: false })}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Row>
            <Col>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Algorithms
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => this.setState({ algo: "BFS" })}>
                    BFS
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.setState({ algo: "DFS" })}>
                    DFS
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => this.setState({ algo: "Dijkstra" })}
                  >
                    Dijkstra
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => this.setState({ algo: "AStar" })}
                  >
                    A Star
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col>
              <Button
                size="sm"
                variant="primary"
                onClick={() => this.visualize()}
              >
                Visualize
              </Button>
            </Col>
            <Col>
              <Button
                size="sm"
                variant="primary"
                onClick={() => this.resetMap()}
              >
                Reset Map
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="grid">
                {grid.map((row, rowIdx) => {
                  return (
                    <div key={rowIdx}>
                      {row.map((node, nodeIdx) => {
                        const { row, col, isFinish, isStart, isWall } = node;
                        return (
                          <Node
                            key={nodeIdx}
                            col={col}
                            isFinish={isFinish}
                            isStart={isStart}
                            isWall={isWall}
                            mouseIsPressed={mouseIsPressed}
                            startNode={this.state.startNode}
                            endNode={this.state.endNode}
                            node={node}
                            setStartNode={this.setStartNode}
                            setEndNode={this.setEndNode}
                            onMouseDown={(row, col) =>
                              this.handleMouseDown(row, col)
                            }
                            onMouseEnter={(row, col) =>
                              this.handleMouseEnter(row, col)
                            }
                            onMouseUp={() => this.handleMouseUp()}
                            row={row}
                          ></Node>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
