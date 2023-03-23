import React from 'react'
import './Node.css'
export default class Node extends React.Component{
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const{rows,cols,isFinish,isStart} = this.props
        const color = isFinish?'node-fin':isStart?'node-start':"";
        return (
            <div className={`node ${color}`} >
            </div>
        )
    }
}
export const DEFAULT_NODE={
    col:0,
    row:0,
}