import React, { Component } from 'react';
import * as d3 from "d3";

class GamesListVisualBubbles extends Component {
  // <props>
  // height: 0
  // width: 0
  // data: []

  constructor(props) {
    super(props);

    this.state = {
      padding: 1.5,
      clusterPadding: 6,
      maxRadius: (props.maxRadius || 80),
      minRadius: (props.minRadius || 10),
    };
  }

  componentDidMount() {
    this.renderVisual(this.element);
  }

  renderVisual(element) {
    var width = this.props.width,
      height = this.props.height,
      padding = this.state.padding, // separation between same-color nodes
      clusterPadding = this.state.clusterPadding, // separation between different-color nodes
      maxRadius = this.state.maxRadius,
      minRadius = this.state.minRadius;

    // NOTE: Much of this rendering code is hacked together using examples online.
    var itemCount = this.props.data.length; // number of distinct clusters
    // The largest node for each cluster.
    var clusters = new Array(itemCount);
    var color = d3.scale.category10().domain(d3.range(this.props.data.length));

    // Identify the largest playtime so we can assign radius values by percentile
    var maxPlaytime = Math.max.apply(Math, this.props.data.map(function (i) { return i.playtime_2weeks; }))

    var i = 0;
    var nodes = this.props.data.map(function (item) {
      var r = Math.max((item.playtime_2weeks / maxPlaytime) * maxRadius, minRadius),
        d = {
          cluster: i,
          radius: r,
          x: Math.cos(i / itemCount * 2 * Math.PI) * 200 + width / 2 + Math.random(),
          y: Math.sin(i / itemCount * 2 * Math.PI) * 200 + height / 2 + Math.random(),
          label: item.name
        };
      clusters[i] = d;
      i++;

      return d;
    });

    var force = d3.layout.force()
      .nodes(nodes)
      .size([width, height])
      .gravity(.02)
      .charge(0)
      .on("tick", tick)
      .start();

    var svg = d3.select(element).append("svg")
      .attr("width", width)
      .attr("height", height);

    var elem = svg.selectAll("circle")
      .data(nodes);

    var node = elem.enter().append("g");

    var circle = node.append("circle")
      .attr("stroke", "black")
      .attr('stroke-width', 0)
      .style("fill", function (d) { return color(d.cluster); })

    var text = node
      .append("text")
      .text(function (d) { return d.label; })
      .attr("stroke", "black");

    node.call(force.drag);

    circle.on("mouseover", function (d, i) {
      d3.select(this).append("text")
        .text(d.x)
        .attr("x", d.x)
        .attr("y", d.y);
    });

    circle.transition()
      .duration(750)
      .delay(function (d, i) { return i * 5; })
      .attrTween("r", function (d) {
        var i = d3.interpolate(0, d.radius);
        return function (t) { return d.radius = i(t); };
      });

    circle.on('mouseover', function () {
      d3.select(this)
        .transition()
        .duration(250)
        .attr('stroke-width', 5)
    });

    circle.on('mouseout', function () {
      d3.select(this)
        .transition()
        .duration(250)
        .attr('stroke-width', 0)
    })

    function tick(e) {
      circle
        .each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });

      text
        .each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("transform", function (d) { return "translate(" + [d.x - (d.radius * .75), d.y] + ")"; })
    }

    // Move d to be adjacent to the cluster circle.
    function cluster(alpha) {
      return function (d) {
        var cluster = clusters[d.cluster];
        if (cluster === d) return;
        var x = d.x - cluster.x,
          y = d.y - cluster.y,
          l = Math.sqrt(x * x + y * y),
          r = d.radius + cluster.radius;
        if (l !== r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(nodes);
      return function (d) {
        var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
  }

  render() {
    return (
      <div>
        {this.props.data.length > 0
          ? <div ref={element => this.element = element} />
          : <p>No games found</p>}
      </div>
    );
  }

}
export default GamesListVisualBubbles;