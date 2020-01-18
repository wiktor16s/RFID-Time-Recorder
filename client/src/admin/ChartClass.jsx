import Chart from "chart.js";

  let createChart = (ctx, id, title, data) => {
    let chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: title,
            backgroundColor: "#64b5f6",
            borderColor: "#64b5f6",
            fill: true,
            data: []
          }
        ]
      },
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.yLabel;
          }
        }
      },
      options: {
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
              type: "time",
              unit: "day",
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Godzina"
              },
              time: {
                tooltipFormat: "HH:mm:ss",
                displayFormats: {
                  millisecond: "HH:mm:ss.SSS",
                  second: "HH:mm:ss",
                  minute: "HH:mm",
                  hour: "HH"
                }
              },

              ticks: {
                major: {
                  fontStyle: "bold",
                  fontColor: "black"
                }
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: "value"
              }
            }
          ]
        }
      }
    });
      return chart;
  }

export default createChart;
