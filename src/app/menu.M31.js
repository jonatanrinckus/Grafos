import React from "react";

export class Menu extends React.Component{
    render(){
        const nodes = this.props.nodes.map((node) => <li key={node.id}>>{node.label}</li>);
        const edges = this.props.edges.map((edge, index) => <li key={index}>From: {edge.from} To: {edge.to}</li>);
        return (
            <div style={{padding: '25px'}} >
                <div>
                    <input onChange={(event) => this.props.nodesToAddChange(event)} value={this.props.nodesToAdd}/>
                    <button onClick={this.props.handleNodesClick}>Add Nodes</button>
                </div>
                <div>
                    <input onChange={(event) => this.props.edgesToAddChange(event)} value={this.props.edgesToAdd}/>
                    <button onClick={this.props.handleEdgesClick}>Add Edges</button>
                </div>
                <button onClick={this.props.handleDraw}>Draw</button>
                <div>
                    <ul>{nodes}</ul>

                    <ul>{edges}</ul>
                </div>
            </div>
        );
    }
};