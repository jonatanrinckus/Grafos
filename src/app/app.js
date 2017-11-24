import React from "react";
import Graph from "react-graph-vis";

import { Menu } from "./menu";

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
    color: '#FFFFFF',
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
  constructor(props) {
    super();
    var nodes = [];
    var edges = [];
    var nodesSeccond = [];
    var edgesSeccond = [];
    this.state = {
      nodes: nodes,
      nodesSeccond: nodesSeccond,
      edges: edges,
      edgesSeccond: edgesSeccond,
      graph: { nodes: nodes, edges: edges },
      graphSeccond: { nodes: nodesSeccond, edges: edgesSeccond },
      options: options,
      draw: false,
      drawSeccond: false,
      //nodesToAdd: 'A,B,C,D,E,F',
      nodesToAdd: 'A,B,C,D',
      // edgesToAdd: 'A>C|7,A>D|2,A>E|10,B>F|2,B>C|3,C>F|3,D>E|7,D>F|4,E>F|8,E>C|9',
       //edgesToAdd: 'A>D|1,A>E|1,A>F|1,B>D|1,B>E|1,B>F|1,C>D|1,C>E|1,C>F|1',
       edgesToAdd: 'A>B|1,A>C|1,A>D|1,B>C|1,B>D|1,C>D|1',
      colors: ["#e0f43d", "#e4c43d", "#15cadb", "#4e4cb5", "#238e2d", "#236a29", "#12ce83", "#4e63ce", "#e0243d", "#ef24fd", "#eff43d"]
    }
  }

  edgesToAddChange = (event) => {
    this.setState({ edgesToAdd: event.target.value })
  }

  nodesToAddChange = (event) => {
    this.setState({ nodesToAdd: event.target.value })
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

      var ed2 = ed[1].split('|');

      var to = this.state.nodes.find(function (obj) {
        return obj.label === ed2[0];
      });

      edges.push({ from: from.id, to: to.id, label: ed2[1] })

      edges.push({ from: to.id, to: from.id, label: ed2[1] })

      var eFrom = { from: from, node: to, size: parseInt(ed2[1]) };
      var eTo = { from: to, node: from, size: parseInt(ed2[1]) };
      // console.log("From", eFrom);
      // console.log("To", eTo);
      from.edges.push(eFrom);
      to.edges.push(eTo);

    });
    this.setState({
      edges: edges,
      graph: { nodes: this.state.nodes, edges: edges },
      edgesToAdd: ''
    });

  }

  handleNodesClick = (params) => {
    this.index++;
    var newNodes = this.state.nodesToAdd.split(',');
    var nodes = this.state.nodes;
    newNodes.map((node) => {
      nodes.push({ id: this.index, label: node, color: "none", edges: [] })
      this.index = this.index + 1;
    });
    this.setState({
      nodes: nodes,
      graph: { nodes: nodes, edges: this.state.edges },
      nodesToAdd: ''
    });
  }

  handleWelshPow = () => {
    if (this.state.draw) {
      this.setState({ draw: false });
    } else {
      this.paintWelshPow();
      this.setState({ draw: true });
    }
  }


  paintWelshPow = () => {

    var index = 0;
    var nodes = this.order();
    console.log("Nodes", nodes);
    nodes.forEach(function (element) {

      if (element.color === "none") {
        element.color = this.state.colors[index];
      }

      var edges = this.state.edges;

      var notTargets = edges.filter(function (obj) {
        return (obj.from === element.id || obj.to === element.id);
      });

      var toPaint = nodes.filter(function (obj) {
        var has = notTargets.filter(function (tar) {
          return (tar.from === obj.id);
        });
        return has.length == 0 && obj.color === "none";
      });


      console.log("Paint", toPaint);

      toPaint.forEach(function (paint) {

        var notTargets = edges.filter(function (obj) {
          return (obj.from == paint.id || obj.to == paint.id);
        });

        console.log(paint, notTargets);

        var has = toPaint.find(function (obj) {
          var tem = notTargets.filter(function (tar) {
            return (tar.to === obj.id) && obj.color !== "none";
          }, this);
          return tem.length > 0;
        });

        if (!has) {
          paint.color = this.state.colors[index];
        }

      }.bind(this), this);

      index++;
    }, this);
  }


  handleDraw = () => {
    if (this.state.draw) {
      this.setState({ draw: false });
    } else {
      this.draw();
      this.setState({ draw: true });
    }
  }

  draw = () => {
    var nodes = this.order();
    console.log(...nodes);
    nodes.forEach(function (element) {
      element.color = "#FFFFFF";
    }, this);
    console.log(...nodes);
  }



  handleDrawPrim = () => {
    if (this.state.draw) {
      this.setState({ draw: false, drawSeccond: false });
    } else {
      this.drawPrim();
      this.setState({ draw: true, drawSeccond: true });
    }
  }

  drawPrim = () => {
    console.log(this.state.nodes);

    for (let n of this.state.nodes) {
      n.color = "#FFFFFF"
    }

    var nodes = [...this.state.nodes];



    nodes = nodes.sort((a, b) => b.id - a.id);

    console.log(nodes);

    var nodesSeccond = [];
    var edgesSeccond = [];

    var first = nodes.find((e) => e.label === "C");

    nodes = nodes.filter((c) => c !== first);

    nodesSeccond.push(first);

    while (nodes.length > 0) {

      let edge = null;
      let from = null;

      console.log("nodesSeccond", [...nodesSeccond]);
      for (let n of nodesSeccond) {
        let near = n.edges.sort((a, b) => {
          let t = a.size - b.size;
          return t;
        }).find((o) => nodes.indexOf(o.node) !== -1);

        console.log("near " + n.label, near);

        if (near) {
          if (!edge) {
            edge = near;
            from = n;
          } else if (near.size < edge.size) {
            edge = near;
            from = n;
          } else {

          }
        } else {
          // if (nodes.length > 0) {
          //   console.log("in");
          //   from = nodes.pop();
          //   nodesSeccond.push(from);
          //   edge = from.edges.sort((a, b) => b.size - a.size).pop();
          //   console.log("edge", edge);
          // }
        }
      }
      console.log("out");

      edgesSeccond.push({ from: from.id, to: edge.node.id, label: edge.size });

      from.edges = from.edges.filter(c => c.node !== edge.node);

      // console.log("from.edges" + from.label, [...from.edges]);
      // console.log("edge.node.edges" + edge.node.label, [...edge.node.edges]);
      edge.node.edges = edge.node.edges.filter(o => o.node !== from);

      // console.log("edge.node.edges" + edge.node.label, [...edge.node.edges]);

      if (nodesSeccond.indexOf(edge.node) === -1)
        nodesSeccond.push(edge.node);


      nodes = nodes.filter(o => o !== edge.node);
    }

    console.log("sum: ", edgesSeccond);
    console.log("sum: ", edgesSeccond.reduce(function (a, b) {
      return a.label + b.label;
    }));


    this.setState({ graphSeccond: { nodes: nodesSeccond, edges: edgesSeccond } });

  }

  handleDrawKruskal = () => {
    if (this.state.draw) {
      this.setState({ draw: false, drawSeccond: false });
    } else {
      this.drawKruskal();
      this.setState({ draw: true, drawSeccond: true });
    }
  }

  drawKruskal = () => {
    console.log(this.state.nodes);

    for (let n of this.state.nodes) {
      n.color = "#FFFFFF"
    }

    var nodes = [...this.state.nodes];



    nodes = nodes.sort((a, b) => b.id - a.id);

    console.log("nodes: ", nodes);



    var floresta = [];

    nodes.forEach(function (element) {
      floresta.push([element]);
    }, this);

    console.log("floresta: ", [...floresta]);
    var nodesSeccond = [];
    var edgesSeccond = [];


    var edges = [];



    for (let node of nodes) {
      for (let egde of node.edges) {
        edges.push(egde);
      }
    }

    edges.sort((a, b) => b.size - a.size);

    console.log("edges: ", edges);

    var aux = [];

    while (edges.length > 0 && floresta.length > 1) {

      console.log("nodesSeccond", [...nodesSeccond]);
      let edge = edges.pop();


      console.log("edges: ", edges);
      console.log("Edge: ", edge);

      var florestaItemFrom = floresta.find((o) => o.indexOf(edge.from) !== -1);
      var florestaItemEdge = floresta.find((o) => o.indexOf(edge.node) !== -1);

      var florestaItemFromInverse = floresta.find((o) => o.indexOf(edge.node) !== -1);
      var florestaItemEdgeInverse = floresta.find((o) => o.indexOf(edge.from) !== -1);

      console.log("florestaItemFrom: ", [...florestaItemFrom]);
      console.log("florestaItemEdge: ", [...florestaItemEdge]);

      if (florestaItemFrom !== florestaItemEdge && florestaItemFromInverse !== florestaItemEdgeInverse) {

        if (!aux.find((c) => c.node == edge.from && c.from == edge.node)) {
          aux.push(edge);
        }

        while (florestaItemEdge.length > 0) {
          let item = florestaItemEdge.pop();
          console.log("item ", item);
          florestaItemFrom.push(item);
        }
      } else {

        console.log("Not added");
      }

      floresta = floresta.filter((f) => f.length > 0);

      console.log("florestaItemFrom out: ", [...florestaItemFrom]);
    }
    console.log("floresta: ", [...floresta]);
    console.log("aux: ", [...aux]);


    for (let a of aux) {
      if (nodesSeccond.indexOf(a.from) === -1) {
        nodesSeccond.push(a.from);
      }

      if (nodesSeccond.indexOf(a.node) === -1) {
        nodesSeccond.push(a.node);
      }
      edgesSeccond.push({ from: a.from.id, to: a.node.id, label: a.size })
    }

    this.setState({ graphSeccond: { nodes: nodesSeccond, edges: edgesSeccond } });

  }


  handleCheckPlanar = () => {
    if (this.state.draw) {
      this.setState({ draw: false });
    } else {
      this.checkPlanar();
      this.setState({ draw: true });
    }
  }

  check3Cycles = (nodes) => {

    for(let node of nodes){
      console.log("node",node)
      for(let edge of node.edges){
        console.log("edge", edge)
        for(let innerEdge of edge.node.edges.filter((c) => c.node != node)){
          console.log("innerEdge", innerEdge)
          console.log("innerEdge.node.edges.find((c) => c.node === node)", innerEdge.node.edges.find((c) => c.node === node))
          if(innerEdge.node.edges.find((c) =>  c.node === node)){
            return true;
          }
        }
      }
    }

    return false;
  }

  checkPlanar = () => {

    var nodes = this.state.nodes;

    if (nodes.length <= 2) {
      alert("Planar, V <= 2")
    } else if (nodes.length >= 3) {
      
      var edges = [];
      
      for (let node of nodes) {
        
        node.color = "#FFFFFF";
        
        for (let egde of node.edges) {
          if(!edges.find((e) => e.from === egde.node && e.node == egde.from))
          {
            edges.push(egde);
          }
        }
      }
      console.log(edges);

      console.log(this.check3Cycles(nodes));

      if(edges.length <= 3*nodes.length-6 && this.check3Cycles(nodes)){
        console.log(edges.length +" <= 3*"+nodes.length+"-6",edges.length <= 3*nodes.length-6);
          alert("Pode ser Planar e contem ciclos de tamanho 3");
      }else if(edges.length <= 2*nodes.length-4){        
        alert("Pode ser planar e não contem ciclos");
      }else if(this.check3Cycles(nodes)){       
        alert("Não é planar e contem ciclos");
      }else{       
        alert("Não é planar e não contem ciclos");
      }
    }



  }


  handleSaturation = () => {
    if (this.state.draw) {
      this.setState({ draw: false });
    } else {
      this.paintDSatur();
      this.setState({ draw: true });
    }
  }

  paintDSatur = () => {

    var index = 0;
    var nodes = this.order();

    console.log("Nodes", nodes);

    for (var index = 0; index < nodes.length; index++) {
      var notPainted = nodes.filter(function (obj) { return obj.color == "none" }).sort(function (a, b) { return b.saturation - a.saturation });


      var elements = notPainted.filter(function (obj) { return obj.saturation === notPainted[0].saturation });


      var element = elements.length === 1 ? elements[0] : elements.sort(function (a, b) { return b.rate - a.rate })[0]

      var edges = this.state.edges;

      var targetsEdges = edges.filter(function (obj) {
        return (obj.from === element.id);
      });

      var nodesLinks = nodes.filter(function (obj) {
        var has = targetsEdges.filter(function (tar) {
          return (tar.to === obj.id);
        });
        return has.length > 0;
      });

      var color = this.state.colors.find(function (c) {
        var has = nodesLinks.filter(function (link) {
          return (link.color === c);
        });
        return has.length === 0;
      });

      element.color = color;

      nodesLinks.forEach(function (link) {
        if (link) {
          var linkOfEdges = edges.filter(function (obj) {
            return (obj.from === link.id);
          });

          var linkOfLinks = nodes.filter(function (obj) {
            var has = linkOfEdges.filter(function (tar) {
              return (tar.to === obj.id);
            });

            return has.length > 0;
          });


          var nodesLinks = nodes.filter(function (obj) {
            var has = linkOfEdges.filter(function (tar) {
              return (tar.to === obj.id);
            });
            return has.length > 0;
          });

          var has = nodesLinks.filter(function (nodeOfLink) {
            return (nodeOfLink.color === color && nodeOfLink.id !== element.id);
          });

          if (has.length === 0) {
            link.saturation += 1;
          }

        }
      }, this);
    }

    return;
    nodes.forEach(function (element) {

      if (element.color === "none") {
        element.color = this.state.colors[index];
      }

      var edges = this.state.edges;

      var targetsEdges = edges.filter(function (obj) {
        return (obj.from === element.id);
      });

      console.log("targetsEdges", targetsEdges);

      var nodesLinks = nodes.filter(function (obj) {
        var has = targetsEdges.filter(function (tar) {
          return (tar.to == obj.id);
        });
        return has.length == 0 && obj.color === "none";
      });
      console.log("nodesLinks", targetsEdges);

      nodesLinks.forEach(function (link) {
        if (link) {
          link.saturation = link.saturation++;
        }
      }, this);



      index++;
    }, this);

  }

  order = () => {
    var nodes = this.state.nodes;
    var newNode = []
    nodes.forEach(function (element) {
      element.color = 'none';
      element.saturation = 0;
      var links = this.state.edges.filter(function (obj) {
        return obj.from === element.id;
      });
      element.rate = links.length;

      console.log("element", element);
      newNode.push(element);
    }, this);

    return newNode.sort(function (a, b) {
      return b.rate - a.rate;
    });
  }

  render() {
    const draw = this.state.draw;
    const drawSeccond = this.state.drawSeccond;
    var toDraw = null;
    var toDrawSeccond = null;

    if (draw) {
      toDraw = <Graph graph={this.state.graph} options={this.state.options} events={events} style={{ height: "640px" }} />;
    }
    if (drawSeccond) {
      console.log(this.state.graphSeccond);
      toDrawSeccond = <Graph graph={this.state.graphSeccond} options={this.state.options} events={events} style={{ height: "640px" }} />
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
            handleDraw={this.handleDraw.bind(this)}
            handleDrawPrim={this.handleDrawPrim.bind(this)}
            handleCheckPlanar={this.handleCheckPlanar.bind(this)}
            handleDrawKruskal={this.handleDrawKruskal.bind(this)}
            welshPow={this.handleWelshPow.bind(this)}></Menu>
        </div>
        <div className="col">
          {toDraw}
          {toDrawSeccond}
        </div>

      </div>
    );
  }
}

export default App;