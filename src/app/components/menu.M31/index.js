import React from "react";

export class Menu extends React.Component{
    render(){
        return (
            <div style={{padding: '25px'}}>

                <input value={this.props.edgesToAdd}/>
                <button onClick={this.props.handleEdgesClick}>Add Edges</button>

            </div>
        );
    }
};