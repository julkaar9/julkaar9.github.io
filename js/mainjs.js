function stackApiHandler() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open(
    "GET",
    "https://api.stackexchange.com/2.3/users/8522463?&site=stackoverflow",
    false
  ); // false for synchronous request
  xmlHttp.send(null);
  let json = JSON.parse(xmlHttp.responseText);

  console.log(json);
  let rep = document.getElementById("reputation");
  let gold = document.getElementById("gold");
  let silver = document.getElementById("silver");
  let bronze = document.getElementById("bronze");
  rep.innerText = json.items[0].reputation;
  gold.innerText = json.items[0].badge_counts.gold;
  silver.innerText = json.items[0].badge_counts.silver;
  bronze.innerText = json.items[0].badge_counts.bronze;
  return xmlHttp.responseText;
}
function codeChefChart() {
  const ctx = document.getElementById("myChart").getContext("2d");
  const dates = [
    "2019-01-14",
    "2019-03-13",
    "2019-03-25",
    "2019-03-28",
    "2019-03-30",
    "2019-04-15",
    "2019-04-17",
    "2019-04-27",
    "2019-04-27",
    "2019-05-13",
    "2019-07-15",
    "2019-08-12",
    "2019-10-14",
    "2020-01-13",
    "2020-03-16",
  ];
  const eloPoints = [
    1470, 1640, 1644, 1675, 1657, 1743, 1766, 1719, 1706, 1768, 1873, 1968,
    2023, 1975, 1819,
  ];
  const ranks = [
    9127, 453, 490, 245, 774, 629, 207, 72, 374, 197, 149, 317, 283, 516, 422,
  ];
  const maxRating = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    2023,
    null,
    null,
  ];

  const threshold1 = 1600;
  const threshold2 = 1800;
  const threshold3 = 2000;
  const threshold4 = 2200;

  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Rating",
          data: eloPoints,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day", // <-- that does the trick here
            displayFormats: {
              hour: "M-Y",
            },
            tooltipFormat: "D-M-Y", // <-- same format for tooltip
          },
        },
      },
      plugins: {
        legend: false,
        title: {
          display: true,
          text: "CodeChef Rating (Max: 2023)",
        },
        tooltip: {
          callbacks: {
            footer: (tooltipItems) => {
              return "Global Rank: " + ranks[tooltipItems[0].dataIndex];
            },
            label: (tooltipItem) => {
              let change = 0;
              let sign = "+";
              if (tooltipItem.dataIndex != 0) {
                change =
                  tooltipItem.dataset.data[tooltipItem.dataIndex] -
                  tooltipItem.dataset.data[tooltipItem.dataIndex - 1];
              } else {
                change = 0;
              }
              if (change < 0) {
                sign = "-";
              }
              return (
                "Rating: " + tooltipItem.parsed.y + "(" + sign + change + ")"
              );
            },
            // labelPointStyle: function (context) {
            //   console.log(context.parsed.y);
            //   return {
            //     pointStyle: context.parsed.y <= 2000 ? "star" : "circle",
            //     rotation: 0,
            //   };
            // },
          },
        },
      },
    },
    plugins: [
      {
        afterLayout: (chart) => {
          let ctx = chart.ctx;
          ctx.save();
          let yAxis = chart.scales.y;
          let yThreshold1 = yAxis.getPixelForValue(1600);
          let yThreshold2 = yAxis.getPixelForValue(1800);
          let yThreshold3 = yAxis.getPixelForValue(2000);

          let gradient = ctx.createLinearGradient(
            0,
            yAxis.top,
            0,
            yAxis.bottom
          );
          let offset1 = (yThreshold1 - yAxis.top) / (yAxis.bottom - yAxis.top);
          let offset2 = (yThreshold2 - yAxis.top) / (yAxis.bottom - yAxis.top);
          let offset3 = (yThreshold3 - yAxis.top) / (yAxis.bottom - yAxis.top);
          gradient.addColorStop(0, "#f2c14e");
          gradient.addColorStop(offset3, "#f2c14e");
          gradient.addColorStop(offset3, "#945FA5");
          gradient.addColorStop(offset2, "#945FA5");
          gradient.addColorStop(offset2, "#688BD8");
          gradient.addColorStop(offset1, "#688BD8");
          gradient.addColorStop(offset1, "#b5e48c");
          gradient.addColorStop(1, "#b5e48c");
          chart.data.datasets[0].borderColor = gradient;
          chart.data.datasets[0].backgroundColor = gradient;
          ctx.restore();
        },
      },
    ],
  });
}

function marksChart(id, sem, gpa) {
  const ctx = document.getElementById(id).getContext("2d");
  console.log(id, sem, gpa);
  const averageAnnot = {
    type: "line",
    borderColor: "#2ec4b6",
    borderDashOffset: 0,
    borderDash: [6, 6],
    borderWidth: 3,
    label: {
      enabled: true,
      content: (ctx) => "Average: " + average(ctx).toFixed(2),
      position: "end",
    },
    scaleID: "y",
    value: (ctx) => average(ctx),
  };
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: sem,
      datasets: [
        {
          label: "GPA",
          data: gpa,
          borderColor: "#2ec4b6",
          backgroundColor: "#2ec4b6",
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          stacked: true,
        },
      },
      plugins: {
        annotation: {
          annotations: {
            averageAnnot,
          },
        },
      },
    },
  });
}

function average(ctx) {
  const values = ctx.chart.data.datasets[0].data;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function bscChart() {
  const sem = [
    "2017(I)",
    "2018(II)",
    "2018(III)",
    "2019(IV)",
    "2019(V)",
    "2020(VI)",
  ];
  const gpa = [7.65, 7.1, 7.83, 8.47, 8.81, 9.38];
  marksChart("bscChart", sem, gpa);
}

function mscChart() {
  const sem = [
    "2017(I)",
    "2018(II)",
    "2018(III)",
    "2019(IV)",
    "2019(V)",
    "2020(VI)",
    "2021(I)",
    "2021(II)",
    "2022(III)",
    "2022(IV)",
  ];
  const gpa = [7.65, 7.1, 7.83, 8.47, 8.81, 9.38, 8.88, 9.12, 9.02, 8.54];
  marksChart("mscChart", sem, gpa);
}
