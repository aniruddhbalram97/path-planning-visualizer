import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
clickNode(){
  const {col, row, isFinish, isStart, setStartNode, setEndNode, node,startNode, endNode} = this.props;
  if(!startNode) {
    setStartNode(row, col);
    node.isStart = true;
    node.isFinish = false;
  }
  else if (startNode && !endNode) {
    console.log(row, col);
    setEndNode(row, col);
    node.isStart = false;
    node.isFinish = true;
  }
  else {
    console.log("Only wall nodes need to be set")
    return
  }
}
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';


    return (
      <div
        id={`node-${row}-${col}`}
        onClick={()=>this.clickNode()}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}