import React from "react";
import Graph from "react-graph-vis";

import { Menu } from "./menu.M31";

const graph = {
  nodes: [
    { id: 1, label: "Node 1", color: "#e04141" },
    { id: 2, label: "Node 2", color: "#e09c41" },
    { id: 3, label: "Node 3", color: "#e0df41" },
    { id: 4, label: "Node 4", color: "#7be041" },
    { id: 5, label: "Node 5", color: "#41e0c9" }
  ],
  edges: [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
  ]
};

const options = {
  layout: {
    improvedLayout: true,
    hierarchical: {
      enabled: false, //change to true to see the other graph
      sortMethod: "directed"
    }
  },
  edges: {
    smooth: true,
    color: "#000",
    arrows: {
      to: {
        enabled: true
      }
    }
  },
  nodes: {
    color: "#FFF",
    fixed: false,
    font: "12px arial red",
    shape: "circle",
    physics: false
  }
};

const events = {
  select: function(event) {
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
      nodesToAdd: "F,V1,S,V2",
      edgesToAdd: "F>V1|5,F>V2|4,V1>V2|1,V1>S|5,V2>S|4"
    };
  }

  edgesToAddChange = event => {
    this.setState({ edgesToAdd: event.target.value });
  };

  nodesToAddChange = event => {
    this.setState({ nodesToAdd: event.target.value });
  };

  index = 0;

  handleEdgesClick = params => {
    var edges = this.createEdges(this.state.nodes);

    this.setState({
      edges: edges,
      graph: { nodes: this.state.nodes, edges: edges }
    });
  };

  createEdges(nodes) {
    let edges = [];
    var newEdges = this.state.edgesToAdd.split(",");
    newEdges.map(edge => {
      var ed = edge.split(">");

      var from = nodes.find(function(obj) {
        return obj.label === ed[0].toUpperCase();
      });

      var ed2 = ed[1].split("|");

      var to = nodes.find(function(obj) {
        return obj.label === ed2[0].toUpperCase();
      });

      edges.push({
        from: from.id,
        to: to.id,
        label: ed2[1]
      });

      var eFrom = { from: from, node: to, size: parseInt(ed2[1]) };

      from.edges.push(eFrom);
    });
    return edges;
  }

  createNodes() {
    var newNodes = this.state.nodesToAdd.split(",");
    this.index++;
    var nodes = [];
    newNodes.map(node => {
      nodes.push({
        id: this.index,
        label: node.toUpperCase(),
        color: "#FFF",
        edges: []
      });
      this.index = this.index + 1;
    });
    return nodes;
  }

  handleNodesClick = params => {
    let nodes = this.createNodes();
    this.setState({
      nodes: nodes,
      graph: { nodes: nodes, edges: this.state.edges }
    });
  };

  handleDraw = () => {
    if (this.state.draw) {
      this.setState({ draw: false });
    } else {
      this.draw();
      this.setState({ draw: true });
    }
  };

  draw = () => {
    this.drawFontAndSorvedor();
  };

  getNodesEdges(nodes) {
    let edges = [];

    for (let node of nodes) {
      edges.push(...node.edges);
    }

    return edges;
  }

  drawFontAndSorvedor() {
    let nodes = this.createNodes();
    let edges = this.createEdges(nodes);
    let nodeEdges = this.getNodesEdges(nodes);

    console.log("nodes", nodes);

    //console.log("nodeEdges", nodeEdges);

    let fontAndSorvedor = this.checkSuperFontOrSuperSorvedor(
      this.detectFontAndSorvedor(nodes)
    );

    let { font, sorvedor } = fontAndSorvedor;
    let s = 0;
    let node = font;

    let path;
    let i = 0;
    while (
      (path = this.getPath(
        this.DFS(
          nodes.filter(n => n !== font && n !== sorvedor),
          [font],
          font,
          sorvedor
        )
      ))
    ) {
      
      console.log("path", path);
      if (!path.length || i == 50) {
        break;
      }
      i += 1;

      let smallEdge = path.sort((a, b) => a.size - b.size).slice(0, 1)[0];

      let size = smallEdge.size;

      s += size;

      for (let item of path) {
        item.size = item.size - size;

        item.from.edges = item.from.edges.filter(e => e.size > 0);

        let inverse = item.node.edges.find(e => e.node.id == item.from.id);

        if (inverse) {
          inverse.size += size;
        } else {
          item.node.edges.push({
            from: item.node,
            node: item.from,
            size: size
          });
        }
      }
    }

    edges = [];

    for (let n of nodes) {
      for (let e of n.edges) {
        edges.push({
          from: e.from.id,
          to: e.node.id,
          label: e.size
        });
      }
    }

    this.setState({
      drawSeccond: true,
      graphSeccond: { nodes: nodes, edges: edges }
    });
  }

  DFS(nodesAux, pilha, node, destino) {
    let found = false;

    while (!found && nodesAux.length) {
      node.visitado = true;

      let nexts = node.edges.map(c => c.node);

      for (let next of nexts) {
        if (!next.visitado) {
          pilha.push(next);

          found = next == destino;
        }
      }

      node = nodesAux.shift();
    }
    console.log("pilha", [...pilha]);
    return pilha;
  }

  getPath(aux) {
    let path = [];

    while (aux.length) {
      let prev = aux.shift();
      let next = aux[0];
      if (next) {
        let p = prev.edges.find(e => e.from == prev && e.node == next);
        if (p) {
          path.push(p);
        }
      }
    }

    return path;
  }

  getMinEdge(node) {
    let edges = [...node.edges];
    let ed = edges.sort((a, b) => b.size - a.size).pop();
    return ed;
  }

  checkSuperFontOrSuperSorvedor(fontAndSorvedor) {
    if (fontAndSorvedor.fonts.length > 1) {
      throw "This graph has multiple fonts, the algoritm is not configured to work with multiple fonts";
      fontAndSorvedor.superFont = {
        id: -1,
        label: "SF",
        color: "#FFF",
        edges: []
      };

      fontAndSorvedor.nodes.push(fontAndSorvedor.superFont);

      for (let font of fontAndSorvedor.font) {
        fontAndSorvedor.superFont.edges.push({
          from: fontAndSorvedor.superFont,
          node: font,
          size: "∞"
        });
      }
    } else {
      fontAndSorvedor.font = fontAndSorvedor.fonts[0];
    }
    if (fontAndSorvedor.sorvedors.length > 1) {
      throw "This graph has multiple sorvedores, the algoritm is not configured to work with multiple sorvedores";
      fontAndSorvedor.superSorcedor = {
        id: -2,
        label: "SS",
        color: "#FFF",
        edges: []
      };

      fontAndSorvedor.nodes.push(fontAndSorvedor.superSorcedor);

      for (let sorvedor of fontAndSorvedor.sorvedor) {
        sorvedor.edges.push({
          from: sorvedor,
          node: fontAndSorvedor.superSorcedor,
          size: "∞"
        });
      }
    } else {
      fontAndSorvedor.sorvedor = fontAndSorvedor.sorvedors[0];
    }
    return fontAndSorvedor;
  }

  detectFontAndSorvedor(nodes) {
    let fontAndSorvedor = {
      nodes,
      fonts: [],
      sorvedors: []
    };

    for (let node of nodes) {
      if (node.edges.length) {
        let isFont = true;
        for (let otherNode of nodes) {
          if (otherNode.edges.find(e => e.node == node)) {
            isFont = false;
          }
        }

        if (isFont) {
          fontAndSorvedor.fonts.push(node);
        }
      } else {
        let isSorvedor = false;

        for (let otherNode of nodes) {
          if (otherNode.edges.find(e => e.node == node)) {
            isSorvedor = true;
          }
        }

        if (isSorvedor) {
          fontAndSorvedor.sorvedors.push(node);
        }
      }
    }
    return fontAndSorvedor;
  }

  render() {
    const draw = this.state.draw;
    const drawSeccond = this.state.drawSeccond;
    var toDraw = null;
    var toDrawSeccond = null;

    if (draw) {
      toDraw = (
        <Graph
          graph={this.state.graph}
          options={this.state.options}
          events={events}
          style={{ height: "640px" }}
        />
      );
    }
    if (drawSeccond) {
      toDrawSeccond = (
        <Graph
          graph={this.state.graphSeccond}
          options={this.state.options}
          events={events}
          style={{ height: "640px" }}
        />
      );
    }

    return (
      <div className="row">
        <div className="col-2">
          <Menu
            handleEdgesClick={this.handleEdgesClick.bind(this)}
            nodes={this.state.nodes}
            edges={this.state.edges}
            nodesToAdd={this.state.nodesToAdd}
            edgesToAdd={this.state.edgesToAdd}
            edgesToAddChange={this.edgesToAddChange.bind(this)}
            nodesToAddChange={this.nodesToAddChange.bind(this)}
            handleNodesClick={this.handleNodesClick.bind(this)}
            handleDraw={this.handleDraw.bind(this)}
          />
        </div>
        <div className="col-5">{toDraw}</div>
        <div className="col-5">{toDrawSeccond}</div>
      </div>
    );
  }
}

export default App;
