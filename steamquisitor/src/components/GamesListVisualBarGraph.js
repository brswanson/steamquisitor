import React, { Component } from 'react';
import * as d3 from "d3";

class GamesListVisualBarGraph extends Component {
  // <props>
  // height: 0
  // width: 0
  // data: []

  constructor(props) {
    super(props);

    this.state = {
      padding: 1.5,
      clusterPadding: 6,
    };
  }

  componentDidMount() {
    this.renderVisual(this.element);
  }

  renderVisual(element) {
    // NOTE: Much of this rendering code is hacked together using examples online.
    var margin = { top: 20, right: 20, bottom: 70, left: 40 };
    var width = this.props.width - margin.left - margin.right;
    var height = this.props.height - margin.top - margin.bottom;

    // Parse the date / time
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

    var svg = d3.select(element).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(this.props.data.map(function (d) { return d.name; }));
    y.domain([0, d3.max(this.props.data, function (d) { return d.playtime_2weeks; })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)")
      .text("");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Minutes Played");

    svg.selectAll("bar")
      .data(this.props.data)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function (d) { return x(d.name); })
      .attr("width", 32)
      .attr("y", function (d) { return y(d.playtime_2weeks); })
      .attr("height", function (d) { return height - y(d.playtime_2weeks); })

    svg.selectAll(null)
      .data(this.props.data)
      .enter()
      .append("image")
      .attr("x", function (d) { return x(d.name); })
      .attr("y", function (d) { return y(d.playtime_2weeks); })
      .attr("transform", "translate(0," + -10 + ")")
      .attr("xlink:href", function (d, i) {
        return `http://media.steampowered.com/steamcommunity/public/images/apps/${d.appid}/${d.img_icon_url}.jpg`
      });
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
export default GamesListVisualBarGraph;