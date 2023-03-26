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
    setEndNode(row, col);
    node.isStart = false;
    node.isFinish = true;
  }
  else {
    console.log("Only wall nodes need to be set")
    return
  }
}
 mouseDown(){
  const {startNode, endNode, row, col, onMouseDown} = this.props;
  if(startNode && endNode) {
    onMouseDown(row, col)
  }
  else {
    return
  }
 }
 mouseEnter(){
  const {startNode, endNode, row, col, onMouseEnter} = this.props;
  if(startNode && endNode) {
    onMouseEnter(row, col)
  }
  else {
    return
  }
 }

 mouseUp(){
  const {startNode, endNode, row, col, onMouseUp} = this.props;
  if(startNode && endNode) {
    onMouseUp(row, col)
  }
  else {
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
      nodeSize
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
        style={{height:nodeSize, width:nodeSize}}
        id={`node-${row}-${col}`}
        onClick={()=>this.clickNode()}
        className={`node ${extraClassName}`}
        onMouseDown={() => this.mouseDown(row, col)}
        onMouseEnter={() => this.mouseEnter(row, col)}
        onMouseUp={() => this.mouseUp()}></div>
    );
  }
}