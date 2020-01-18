import React, { Component } from "react";
import createChart from "../../admin/ChartClass";
import Chart from "chart.js";
import "chartjs-plugin-datalabels";
import moment from "moment";

import { Doughnut } from "react-chartjs-2";

import "./styles.css";

class ChartsGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.props);
    const canvas = this.canvasRef.current;
    const context = canvas.getContext("2d");
    console.log("prop map -> ", this.props.data);
    if (this.props.data.map) {
      this.myChart = new Chart(context, {
        type: "line",
        animation: {
          duration: 0
        },
        data: {
          labels: this.props.data.map(d => d.x),
          datasets: [
            {
              label: this.props.title,
              backgroundColor: "#64b5f6",
              borderColor: "#64b5f6",
              fill: true,
              data: this.props.data.map(d => d.y)
            }
          ]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.yLabel;
            }
          }
        },
        options: {
          layout: {
            padding: {
              left: 50,
              right: 50,
              top: 20,
              bottom: 0
            }
          },
          elements: {
            line: {
              tension: 0
            }
          },
          responsive: true,
          title: {
            display: false,
            text: "Chart.js Time Point Data"
          },
          scales: {
            xAxes: [
              {
                stacked: true,
                type: "time",
                unit: "day",
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "Godzina"
                },
                time: {
                  type: "time",
                  distribution: "series",

                  tooltipFormat: "HH:mm:ss",
                  displayFormats: {
                    millisecond: "HH:mm:ss.SSS",
                    second: "HH:mm:ss",
                    minute: "HH:mm",
                    hour: "HH"
                  }
                },

                ticks: {
                  min: 100,
                  major: {
                    fontStyle: "bold",
                    fontColor: "none"
                  }
                }
              }
            ],
            yAxes: [
              {
                stacked: true,
                display: true,
                scaleLabel: {
                  display: false,
                  labelString: "value"
                }
              }
            ]
          },
          plugins: {
            datalabels: {
              color: "red",
              align: "end",
              font: {
                weight: "bold",
                size: 14
              },
              padding: {
                bottom: 1
              },
              formatter: function(value, context) {
                if (value === 1) {
                  return `${moment(
                    context.chart.data.labels[context.dataIndex]
                  ).format("HH:mm:ss")}`;
                } else {
                  return "";
                }
              }
            }
          }
        }
      });
    }
  }

  componentDidUpdate() {
        console.log(this.props.data);
        this.myChart.data.labels = this.props.data.map(d => d.x);
        this.myChart.data.datasets[0].data = this.props.data.map(d => d.y);
        this.myChart.update();
     
    
  }

  doRender() {
    if (!this.myChart) {
    }
  }

  render() {
    return (
      <div style={{ width: "90%", marginLeft: "auto", marginRight: "auto" }}>
        <canvas height="20" className="canvas-chart" ref={this.canvasRef} />
      </div>
    );
  }
}

export default ChartsGroup;
