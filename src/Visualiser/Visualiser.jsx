import React from "react";
import Node from "./Node/Node";
import "./Visualiser.css";

export default class Visualiser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeGrid: [],
      rows: 20,
      cols: 30,
    };
  }
  componentDidMount() {
    const nodeGrid = [];
    const { rows, cols } = this.state;
    for (let row = 0; row < rows; row++) {
      const currRow = [];
      for (let col = 0; col < cols; col++) {
        console.log(col)
        const currNode = {
          col,
          row,
          isStart: row === 10 && col === 5,
          isFinish: row === 10 && col === 15,
        };
        currRow.push(currNode);
      }
      nodeGrid.push(currRow);
    }
    this.setState({ nodeGrid: nodeGrid });
  }
  render() {
    const { nodeGrid, rows, cols } = this.state;
    return (
      <div className="grid">
        {nodeGrid.map((row, r_idx) => {
          return (
            <div key={r_idx}>
              {row.map((node, node_idx) => {
                const {isStart, isFinish} = node;
                return <Node 
                rows={rows} 
                cols={cols} 
                key={node_idx} 
                isStart={isStart} 
                isFinish ={isFinish}> 
                </Node>;
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
