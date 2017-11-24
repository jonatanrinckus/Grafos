import React from "react";
import Graph from "react-graph-vis";

import {Menu } from "./menu";

const graph = {
nodes: [
    { id: 1, label: "Node 1", color: "#e04141" },
    { id: 2, label: "Node 2", color: "#e09c41" },
    { id: 3, label: "Node 3", color: "#e0df41" },
    { id: 4, label: "Node 4", color: "#7be041" },
    { id: 5, label: "Node 5", color: "#41e0c9" }
  ],
  edges: [{ from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 2, to: 5 }]
};

const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#000000",
    arrows: {
      to: {
        enabled: false
      }
    }
  },
  nodes: {
    color: '#ff0000',
    fixed: false,
    font: '12px arial red',
    shape: 'circle',
    physics: false
  }
};

const events = {
  select: function (event) {
    var { nodes, edges } = event;
  }
};

const arr = Array;


class App extends React.Component {
  constructor(props){
    super();
    var nodes = [];
    var edges = [];
    this.state = {
      nodes: nodes,
      edges: edges,
      graph: {nodes: nodes, edges: edges},
      options: options,
      draw: false,
      //nodesToAdd: '0,1,2,3,4,5',
      nodesToAdd: '0,1,2,3,4',
      //edgesToAdd: '0>3,0>5,1>4,1>2,2>5,3>4',
      //edgesToAdd: '0>1,0>2,0>3,0>4,1>2,1>3,1>4,2>3,2>4,3>4',
      edgesToAdd: '0>1,0>2,1>3,2>4,3>4',
      colors: ["#e0f43d", "#e4c43d", "#15cadb", "#4e4cb5", "#238e2d", "#236a29", "#12ce83", "#4e63ce", "#e0243d", "#ef24fd", "#eff43d"]
    }
  }

  edgesToAddChange = (event) => {
    this.setState({edgesToAdd: event.target.value})
  }

  nodesToAddChange = (event) => {
    this.setState({nodesToAdd: event.target.value})
  }
  
  index = 0;

  handleEdgesClick = (params) => {
    var newEdges = this.state.edgesToAdd.split(','); 
    var edges = this.state.edges;
    newEdges.map((edge) => {
      
      var ed = edge.split('>')
      var from = this.state.nodes.find(function (obj) {
          return obj.label === ed[0];
      });
      
      var to = this.state.nodes.find(function (obj) {

        return obj.label === ed[1];
      });
      edges.push({ from: from.id, to:  to.id })
      edges.push({ from:  to.id, to: from.id })
      
    });
    this.setState({
      edges: edges,
      graph: {nodes: this.state.nodes, edges: edges},
      edgesToAdd: ''
    });
  }
  
  handleNodesClick = (params) => {
    this.index++;
    var newNodes = this.state.nodesToAdd.split(','); 
    var nodes = this.state.nodes;
    newNodes.map((node) => {
      nodes.push({ id: this.index, label: node, color: "none" })
      this.index = this.index + 1;
    });
    this.setState({
      nodes: nodes,
      graph: {nodes: nodes, edges: this.state.edges},
      nodesToAdd: ''
    });
  }

  handleWelshPow = () => {
    if(this.state.draw){
      this.setState({draw:false});
    }else{
      this.paintWelshPow();
      this.setState({draw:true});
    }    
  }



  paintWelshPow = () => {
    
    var index = 0;
    var nodes = this.order();
    console.log("Nodes", nodes);
    nodes.forEach(function(element) {

      if(element.color === "none")
      {
        element.color = this.state.colors[index];        
      }

      var edges = this.state.edges;
      
      var notTargets = edges.filter(function(obj){
            return (obj.from === element.id || obj.to === element.id);
      });

      var toPaint = nodes.filter(function(obj){
        var has = notTargets.filter(function(tar){
          return (tar.from === obj.id);
        });
        return has.length == 0 && obj.color === "none";
      });
      console.log("Paint", toPaint);
     

      toPaint.forEach(function(paint) {
        if(paint)
        {
          paint.color = this.state.colors[index]; 
        }
      }, this);

      
      index++;
    }, this);
  }


  handleSaturation = () => {
    if(this.state.draw){
      this.setState({draw:false});
    }else{
      this.paintDSatur();
      this.setState({draw:true});
    }    
  }
  
  paintDSatur = () => {
    
    var index = 0;
    var nodes = this.order();

    console.log("Nodes", nodes);

    for (var index = 0; index < nodes.length; index++) {
      var notPainted = nodes.filter(function(obj){ return obj.color == "none"}).sort(function(a,b){return b.saturation - a.saturation});
      

      var elements = notPainted.filter(function (obj){return obj.saturation === notPainted[0].saturation});


      var element = elements.length === 1 ? elements[0] : elements.sort(function(a,b){ return b.rate - a.rate})[0]
      
      var edges = this.state.edges;
      
      var targetsEdges = edges.filter(function(obj){
            return (obj.from === element.id);
      });

      var nodesLinks = nodes.filter(function(obj){
        var has = targetsEdges.filter(function(tar){
          return (tar.to === obj.id);
        });
        return has.length > 0;
      });

      var color = this.state.colors.find(function(c) {
        var has = nodesLinks.filter(function(link){
          return (link.color === c);
        });
        return has.length === 0;
      });

      element.color = color;
      
      nodesLinks.forEach(function(link) {
        if(link)
        {
          var linkOfEdges = edges.filter(function(obj){
            return (obj.from === link.id);
          });

          var linkOfLinks = nodes.filter(function(obj){
            var has = linkOfEdges.filter(function(tar){
              return (tar.to === obj.id);
            });

            return has.length > 0;
          });


          var nodesLinks = nodes.filter(function(obj){
            var has = linkOfEdges.filter(function(tar){
              return (tar.to === obj.id);
            });
            return has.length > 0;
          });

          var has = nodesLinks.filter(function(nodeOfLink){
            return (nodeOfLink.color === color && nodeOfLink.id !== element.id);
          });

          if(has.length === 0){
            link.saturation += 1; 
          }

        }
      }, this);     
    }

    return;
    nodes.forEach(function(element) {

      if(element.color === "none")
      {
        element.color = this.state.colors[index];        
      }

      var edges = this.state.edges;
      
      var targetsEdges = edges.filter(function(obj){
            return (obj.from === element.id);
      });

      console.log("targetsEdges", targetsEdges);

      var nodesLinks = nodes.filter(function(obj){
        var has = targetsEdges.filter(function(tar){
          return (tar.to == obj.id);
        });
        return has.length == 0 && obj.color === "none";
      });
      console.log("nodesLinks", targetsEdges);

      nodesLinks.forEach(function(link) {
        if(link)
        {
          link.saturation = link.saturation++; 
        }
      }, this);

      

      index++;
    }, this);
    
  }

  order = () => {
      var nodes = this.state.nodes;
      var newNode = []
      nodes.forEach(function(element) {
        element.color = 'none';
        element.saturation = 0;
        var links = this.state.edges.filter(function(obj){
          return obj.from === element.id;
        });
        element.rate = links.length;
        
        console.log("element", element);
        newNode.push(element);
      }, this);

      return newNode.sort(function(a,b){
          return b.rate - a.rate;
      });      
  }

  render() {
    const draw = this.state.draw;
    var toDraw = null;

    if(draw){
      toDraw = <Graph graph={this.state.graph} options={this.state.options} events={events} style={{ height: "640px" }} />;
    }
    return (
      <div className="row">
        <div className="col-4" >
          <Menu handleEdgesClick={this.handleEdgesClick.bind(this)} 
          nodes={this.state.nodes}
          edges={this.state.edges}
          nodesToAdd={this.state.nodesToAdd}
          edgesToAdd={this.state.edgesToAdd}
          edgesToAddChange={this.edgesToAddChange.bind(this)}
          nodesToAddChange={this.nodesToAddChange.bind(this)}
            handleNodesClick={this.handleNodesClick.bind(this)}
            saturation={this.handleSaturation.bind(this)}
          
            welshPow={this.handleWelshPow.bind(this)}></Menu>
        </div>
        <div className="col">
          {toDraw}
        </div>

      </div>
    );
  }
}

export default App;