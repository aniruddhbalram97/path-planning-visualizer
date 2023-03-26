import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Node from "./Node/Node";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import Logo from "../files/logo.png";
import { BFS } from "../algorithms/bfs";
import { DFS } from "../algorithms/dfs";
import { astar } from "../algorithms/astar";

import "./Visualiser.css";

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      algo: "Choose Algorithm",
      START_NODE_ROW: "",
      START_NODE_COL: "",
      FINISH_NODE_ROW: "",
      FINISH_NODE_COL: "",
      startNode: null,
      endNode: null,
      modalTitle: "Start & End Goals",
      modalBody: "Click on Nodes to set Start and End Nodes",
      show: "",
      visitedNodesInOrder: [],
      nodesInShortestPathOrder: [],
      nodeSize: "",
    };
    this.setStartNode = this.setStartNode.bind(this);
    this.setEndNode = this.setEndNode.bind(this);
    this.updateNodeSize = this.updateNodeSize.bind(this);
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.updateNodeSize();
    window.addEventListener("resize", this.updateNodeSize);
    this.setState({ grid, show: true });
  }
  updateNodeSize() {
    let width = window.innerWidth - 100;
    let height = window.innerHeight - 56 - 35;
    let nodeWidth = width / 50;
    let nodeHeight = height / 20;
    if (nodeWidth < nodeHeight) {
      this.setState({ nodeSize: nodeWidth, height: height, width: width });
    } else {
      this.setState({ nodeSize: nodeHeight, height: height, width: width });
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateNodeSize);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.startNode != prevState.startNode) {
      let grid = this.getInitialGrid();
      this.setState({ grid: grid });
    }
    if (this.state.endNode != prevState.endNode) {
      let grid = this.getInitialGrid();
      this.setState({ grid: grid });
    }
    if (
      this.state.endNode &&
      this.state.startNode &&
      this.state.startNode == prevState.startNode &&
      this.state.endNode != prevState.endNode
    ) {
      this.setState({
        modalTitle: "Great! Now set the obstacle walls and choose an algorithm",
        modalBody:
          "Hold click and drag around the grid to set walls. Then choose the algorithm",
        show: true,
      });
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
    const { visitedNodesInOrder, nodesInShortestPathOrder } = this.state;
    if (visitedNodesInOrder) {
      for (let i = 0; i < visitedNodesInOrder.length; i++) {
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          if (
            node.row == this.state.START_NODE_ROW &&
            node.col == this.state.START_NODE_COL
          ) {
            console.log("start node");
          } else if (
            node.row == this.state.FINISH_NODE_ROW &&
            node.col == this.state.FINISH_NODE_COL
          ) {
            console.log("finish node");
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node";
          }
        },  i);
      }
    }
    if (nodesInShortestPathOrder) {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          if (
            node.row == this.state.START_NODE_ROW &&
            node.col == this.state.START_NODE_COL
          ) {
            console.log("start node");
          } else if (
            node.row == this.state.FINISH_NODE_ROW &&
            node.col == this.state.FINISH_NODE_COL
          ) {
            console.log("finish node");
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node";
          }
        }, i);
      }
    }
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
    this.setState({
      START_NODE_ROW: row,
      START_NODE_COL: col,
      startNode: true,
    });
  }
  setEndNode(row, col) {
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
        if (
          node.row == this.state.START_NODE_ROW &&
          node.col == this.state.START_NODE_COL
        ) {
          console.log("start node");
        } else if (
          node.row == this.state.FINISH_NODE_ROW &&
          node.col == this.state.FINISH_NODE_COL
        ) {
          console.log("finish node");
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (
          node.row == this.state.START_NODE_ROW &&
          node.col == this.state.START_NODE_COL
        ) {
          console.log("start node");
        } else if (
          node.row == this.state.FINISH_NODE_ROW &&
          node.col == this.state.FINISH_NODE_COL
        ) {
          console.log("finish node");
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }
      }, 50 * i);
    }
  }

  visualize() {
    const { startNode, endNode } = this.state;
    if (startNode && endNode && this.state.algo != "Choose Algorithm") {
      const { grid } = this.state;
      const startNode_ =
        grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
      const finishNode_ =
        grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
      let visitedNodesInOrder = [];
      switch (this.state.algo) {
        case "BFS": {
          visitedNodesInOrder = BFS(grid, startNode_, finishNode_);
          break;
        }
        case "DFS": {
          visitedNodesInOrder = DFS(grid, startNode_, finishNode_);
          break;
        }
        case "Dijkstra": {
          visitedNodesInOrder = dijkstra(grid, startNode_, finishNode_);
          break;
        }
        case "A*": {
          visitedNodesInOrder = astar(grid, startNode_, finishNode_);
          break;
        }
        default: {
          console.log("The algorithm hasn't been selected");
        }
      }
      this.setState({ visitedNodesInOrder: visitedNodesInOrder });
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode_);
      this.setState({ nodesInShortestPathOrder: nodesInShortestPathOrder });
      this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
    } else {
      this.setState({
        modalTitle: "You have not set an Algorithm!",
        modalBody: "Please choose an Algorithm before Visualising",
        show: true,
      });
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand>
              <img
                alt="Page Logo"
                src={Logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              PathVis
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <NavDropdown
                  title={this.state.algo}
                  id={`${
                    this.state.algo === "Choose Algorithm" ? "" : "green-"
                  }nav-dropdown`}
                >
                  <NavDropdown.Item
                    onClick={() => this.setState({ algo: "BFS" })}
                  >
                    BFS
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => this.setState({ algo: "DFS" })}
                  >
                    DFS
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => this.setState({ algo: "Dijkstra" })}
                  >
                    Dijkstra
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => this.setState({ algo: "A*" })}
                  >
                    A*
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link
                  style={{ color: "#D0312D" }}
                  onClick={() => this.resetMap()}
                >
                  Clear Map
                </Nav.Link>
              </Nav>
              <Form className="d-flex">
                <Button
                  variant={`${
                    this.state.startNode &&
                    this.state.endNode &&
                    this.state.algo != "Choose Algorithm"
                      ? "success"
                      : "secondary"
                  }`}
                  onClick={() => this.visualize()}
                >
                  Visualize
                </Button>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container fluid>
          <Modal
            show={this.state.show}
            onHide={() => this.setState({ show: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title>{this.state.modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.state.modalBody}</Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => this.setState({ show: false })}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Row
            className="align-items-center"
            style={{ height: this.state.height }}
          >
            <Col>
              <div className="grid">
                {grid.map((row, rowIdx) => {
                  return (
                    <div key={rowIdx} className="grid-row">
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
                            nodeSize={this.state.nodeSize}
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
