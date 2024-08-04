function fetchNetworkDevices() {
    $.get("op/get_opmanager.php").done(function (data) {
      var wirelessDevices = [];
      var switchDevices = [];
      var routerDevices = [];
      var firewallDevices = [];
  
      if (data) {
        data.forEach((value) => {
          switch (value.category) {
            case "Wireless":
              wirelessDevices.push(value);
              break;
            case "Switch":
              switchDevices.push(value);
              break;
            case "Router":
              routerDevices.push(value);
              break;
            case "Firewall":
              firewallDevices.push(value);
              break;
            default:
              console.log("Unknown Category");
              break;
          }
        });
  
        // Find the maximum count among all categories
        var maxCount = Math.max(
          wirelessDevices.length,
          switchDevices.length,
          routerDevices.length,
          firewallDevices.length
        );
  
        // Update HTML counts and progress bars if the length is greater than 0
        updateNetworkProgress("Wireless", wirelessDevices, maxCount);
        updateNetworkProgress("Switch", switchDevices, maxCount);
        updateNetworkProgress("Router", routerDevices, maxCount);
        updateNetworkProgress("Firewall", firewallDevices, maxCount);
      }
    });
  }
  
  function updateNetworkProgress(category, devices, maxCount) {
    const count = devices.length;
    const progressContainer = document.getElementById(`progress-container-${category}`);
    
    if (count > 0) {
      // Update count in HTML
      document.querySelector(`.${category.toLowerCase()}Count`).textContent = count;
  
      // Show the progress bar container
      progressContainer.style.display = 'block';
  
      // Update progress bar segments
      updateNetworkProgressBar(category, devices, maxCount);
    } else {
      // Hide the progress bar container if count is zero
      progressContainer.style.display = 'none';
    }
  }
  
  function updateNetworkProgressBar(category, devices, maxCount) {
    var progress = document.getElementById(`progress-${category}`);
    if (progress) {
      progress.innerHTML = ""; // Clear previous content
  
      // Count status occurrences
      var statusCounts = {
        "Clear": 0,
        "Trouble": 0,
        "Attention": 0,
        "Critical": 0
      };
  
      devices.forEach(device => {
        if (statusCounts.hasOwnProperty(device.statusStr)) {
          statusCounts[device.statusStr]++;
        }
      });
  
      // Calculate total count for scaling
      var totalCount = devices.length;
  
      // Calculate percentage widths for each status
      var clearWidth = (statusCounts["Clear"] / totalCount) * 100;
      var troubleWidth = (statusCounts["Trouble"] / totalCount) * 100;
      var attentionWidth = (statusCounts["Attention"] / totalCount) * 100;
      var criticalWidth = (statusCounts["Critical"] / totalCount) * 100;
  
      // Create segments based on widths and colors
      if (clearWidth > 0) {
        var clearSegment = document.createElement("div");
        clearSegment.style.width = `${clearWidth}%`;
        clearSegment.style.backgroundColor = "#90d67f"; // Green for Clear
        clearSegment.className = "progress-segment";
        progress.appendChild(clearSegment);
      }
      if (troubleWidth > 0) {
        var troubleSegment = document.createElement("div");
        troubleSegment.style.width = `${troubleWidth}%`;
        troubleSegment.style.backgroundColor = "#faae70"; // Orange for Trouble
        troubleSegment.className = "progress-segment";
        progress.appendChild(troubleSegment);
      }
      if (attentionWidth > 0) {
        var attentionSegment = document.createElement("div");
        attentionSegment.style.width = `${attentionWidth}%`;
        attentionSegment.style.backgroundColor = "#8da8fd"; // Blue for Attention
        attentionSegment.className = "progress-segment";
        progress.appendChild(attentionSegment);
      }
      if (criticalWidth > 0) {
        var criticalSegment = document.createElement("div");
        criticalSegment.style.width = `${criticalWidth}%`;
        criticalSegment.style.backgroundColor = "#e42855"; // Red for Critical
        criticalSegment.className = "progress-segment";
        progress.appendChild(criticalSegment);
      }
    } else {
      console.log(`Progress bar not found for ${category}`);
    }
  }

fetchNetworkDevices();

function networkDeviceStatus() {
    $.get("op/get_opmanager.php").done(function (data) {
        // Initialize arrays for each status
        var clearDevices = [];
        var troubleDevices = [];
        var attentionDevices = [];
        var criticalDevices = [];

        // Process fetched data
        if (data) {
            data.forEach((value) => {
                if (["Wireless", "Switch", "Router", "Firewall"].includes(value.category)) {
                    switch (value.statusStr) {
                        case "Clear":
                            clearDevices.push(value);
                            break;
                        case "Trouble":
                            troubleDevices.push(value);
                            break;
                        case "Attention":
                            attentionDevices.push(value);
                            break;
                        case "Critical":
                            criticalDevices.push(value);
                            break;
                        default:
                            console.log("Unknown Status");
                            break;
                    }
                }
            });
        }
        
        // Calculate total counts
        var clearCount = clearDevices.length;
        var troubleCount = troubleDevices.length;
        var attentionCount = attentionDevices.length;
        var criticalCount = criticalDevices.length;

        // Total count of all devices
        var totalCount = clearCount + troubleCount + attentionCount + criticalCount;

        // Data for the chart
        const chartData = {
            labels: ["Clear", "Trouble", "Attention", "Critical"],
            datasets: [
                {
                    label: "Devices",
                    data: [clearCount, troubleCount, attentionCount, criticalCount],
                    backgroundColor: ['#90d67f', '#faae70', '#8da8fd', '#e42855'],
                    hoverOffset: 7,
                },
            ],
        };

        // Configuration for the doughnut chart
        const config = {
            type: "doughnut",
            data: chartData,
            options: {
                responsive: true,
                cutout: "70%", // Adjust this value to make the sections smaller
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.label || "";
                                if (label) {
                                    label += ": ";
                                }
                                if (context.raw !== null) {
                                    label += context.raw;
                                }
                                return label;
                            },
                        },
                    },
                    datalabels: {
                        color: "#fff",
                        font: {
                            weight: "bold",
                        },
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map((data) => {
                                sum += data;
                            });
                            let percentage = ((value * 100) / sum).toFixed(2) + "%";
                            return percentage;
                        },
                    },
                },
            },
            plugins: [
                {
                    id: "centerText",
                    beforeDraw: function (chart) {
                        var width = chart.width,
                            height = chart.height,
                            ctx = chart.ctx;

                        ctx.restore();
                        var fontSize = (height / 90).toFixed(2);
                        ctx.font = `bold ${fontSize}em sans-serif`; // Set the font to bold
                        ctx.textBaseline = "middle";
                        ctx.fillStyle = "#9a9cae";

                        ctx.beginPath();
                        ctx.arc(width / 2, height / 2, Math.min(width, height) / 4, 0, 2 * Math.PI);
                        ctx.fillStyle = '#1d2231'; // Background color
                        ctx.fill();

                        ctx.fillStyle = '#fff'; // Text color
                        var text = totalCount,
                            textX = Math.round((width - ctx.measureText(text).width) / 2),
                            textY = height / 1.92;

                        ctx.fillText(text, textX, textY);
                        ctx.save();
                    },
                },
            ],
        };

        chartData.datasets.forEach((dataset) => {
            dataset.borderWidth = 4; // Adjust the width to create space between sections
            dataset.hoverBorderWidth = 5; // Ensure the hover border width matches
            dataset.borderColor = "#15171C"; // Set the border color to create visible gaps
            dataset.hoverBorderColor = "#15171C"; // Ensure the hover border color matches
        });

        // Initialize the chart
        const networkChart = new Chart(
            document.getElementById("network-doughnut-chart"),
            config
        );
    });
}

networkDeviceStatus();

function fetchRecentNetworkAlarms() {
    $.get("op/get_opAlerts.php").done(function (data) {
        if (data) {

            const allowedCategories = ["Wireless", "Switch", "Firewall", "Router"];
            const allowedStatus = ["Critical", "Attention", "Trouble", "ServiceDown"];
            const filteredAlarms = data.filter(alarm => allowedCategories.includes(alarm.category));
            const alarmCount = data.filter(alarm => 
                allowedCategories.includes(alarm.category) && 
                allowedStatus.includes(alarm.statusStr)
            );

            $(".networkAlarmCount").text(alarmCount.length);

            const alarms = filteredAlarms.slice(0, 5); // Get only the first 5 alarms
            let criticalAlarmsFound = false;

            alarms.forEach(alarm => {
                let alertClass, borderClass, iconHtml, colorStyle, title;

                switch (alarm.statusStr) {
                    case 'Trouble':
                        alertClass = 'alert alert-subtle-warning';
                        borderClass = 'border-warning';
                        iconHtml = `<div class="d-flex align-items-center" role="alert">
                                        <span class="uil uil-exclamation-circle text-warning me-3 fs-5"></span>
                                    </div>`;
                        colorStyle = 'border-color: #faae70 !important; padding: 0.6rem;';
                        title = 'Trouble';
                        break;
                    case 'Critical':
                        alertClass = 'alert alert-subtle-danger';
                        borderClass = 'border-danger';
                        iconHtml = `<div class="d-flex align-items-center" role="alert">
                                        <span class="uil uil-times-circle text-danger me-3 fs-5"></span>
                                    </div>`;
                        colorStyle = 'border-color: #e42855 !important; padding: 0.6rem;';
                        title = 'Critical';
                        criticalAlarmsFound = true; // Set flag to true for critical alarm
                        break;
                    case 'Clear':
                        alertClass = 'alert alert-subtle-success';
                        borderClass = 'border-success';
                        iconHtml = `<div class="d-flex align-items-center" role="alert">
                                        <span class="uil uil-check-circle text-success me-3 fs-5"></span>
                                    </div>`;
                        colorStyle = 'border-color: #90d67f !important; padding: 0.6rem';
                        title = 'Clear';
                        break;
                    case 'Attention':
                        alertClass = 'alert alert-subtle-primary';
                        borderClass = 'border-primary';
                        iconHtml = `<div class="d-flex align-items-center" role="alert">
                                        <span class="uil uil-info-circle text-primary me-3 fs-5"></span>
                                    </div>`;
                        colorStyle = 'border-color: #8da8fd !important; padding: 0.6rem;';
                        title = 'Attention';
                        break;
                    default:
                        return;
                }

                const alertDiv = `
                  <div class="alert ${alertClass} d-flex flex-column flex-sm-row w-80 border ${borderClass} border-2" style="${colorStyle}">
                      <!--begin::Icon-->
                      ${iconHtml}
                      <!--end::Icon-->
                      <!--begin::Content-->
                      <div class="d-flex flex-column mt-1">
                          <h6 class="mb-1">
                              ${alarm.displayName}<span class="badge badge-phoenix badge-phoenix-info rounded-pill fs-10 ms-2">
                              <span class="badge-label">${alarm.category}</span>
                              </span>
                          </h6>
                          <span style="font-size:12px">${alarm.message}</span>
                          <span style="font-size:12px">${alarm.modTime}</span>
                      </div>
                      <!--end::Content-->
                  </div>
              `;

                // Append to the main container
                $('#networkAlert-container').append(alertDiv);

            });

        } else {
            console.error("Error fetching data.");
        }
    });
}

fetchRecentNetworkAlarms();

function fetchNetworkAvailability() {
    $.get("op/get_opWidgets.php").done(function (data) {
        if (data) {
            const chartData = [];
            const id = "10000003006";

            const widgetData = data[id][id]["WidgetData"];
            widgetData.forEach(device => {
                chartData.push({
                    displayName: device.displayName,
                    ipAddress: device.ipAddress,
                    availability: parseFloat(device.availability),
                    unavailability: -1 * (100 - parseFloat(device.availability))  // Make unavailability negative
                });
            });

            // Sort the data to get the top 10 devices by availability
            chartData.sort((a, b) => b.availability - a.availability);
            const top10Data = chartData.slice(0, 10);

            const labels = top10Data.map(device => `${device.displayName}`);
            const availability = top10Data.map(device => device.availability);
            const unavailability = top10Data.map(device => device.unavailability);

            const ctx = document.getElementById('networkAvailabilityChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Availability (%)',
                            data: availability,
                            backgroundColor: '#90d67f', // Green for availability
                            borderColor: '#90d67f',
                            borderWidth: 1,
                            barThickness: 15  // Adjust this value to control bar thickness
                        },
                        {
                            label: 'Unavailability (%)',
                            data: unavailability,
                            backgroundColor: '#e42855', // Red for unavailability
                            borderColor: '#e42855',
                            borderWidth: 1,
                            barThickness: 15  // Adjust this value to control bar thickness
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',  // This makes the bar chart horizontal
                    scales: {
                        y: {
                            ticks: {
                                color: 'white',  // Change y-axis label color to white
                                font: {
                                    size: 12  // Adjust the font size
                                }
                            },
                            stacked: true  // Stack the bars horizontally
                        },
                        x: {
                            ticks: {
                                color: 'white',  // Change x-axis label color to white
                                font: {
                                    size: 12  // Adjust the font size
                                },
                                beginAtZero: true,
                                stepSize: 10,  // Set increments to 10
                                min: -100,  // Set minimum value
                                max: 100    // Set maximum value
                            },
                            stacked: true  // Stack the bars horizontally
                        }
                    },
                    plugins: {
                        tooltip: {
                            titleFont: {
                                size: 10  // Tooltip title text size
                            },
                            bodyFont: {
                                size: 10  // Tooltip body text size
                            }
                        },
                        legend: {
                            display: true  // Show the legend
                        }
                    },
                    barPercentage: 0.4,
                    categoryPercentage: 0.6
                }
            });

        } else {
            console.error("Error fetching data.");
        }
    });
}

fetchNetworkAvailability();

function fetchNetworkUtilization() {
    $.get("op/get_opWidgets.php").done(function (data) {
        if (data) {
            const chartData = [];
            const id = "10000003008";

            const widgetData = data[id][id]["WidgetData"];
            widgetData.forEach(device => {
                chartData.push({
                    displayName: device.displayName,
                    utilization: parseFloat(device.value)
                });
            });

            // Sort the data to get the top 10 devices by utilization
            chartData.sort((a, b) => b.utilization - a.utilization);
            const top10Data = chartData.slice(0, 10);

            const labels = top10Data.map(device => `${device.displayName}`);
            const utilization = top10Data.map(device => device.utilization);

            const ctx = document.getElementById('networkUtilizationChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            // Base bars (light gray background)
                            label: 'Base Utilization (%)',
                            data: Array(top10Data.length).fill(100),  // Full bar for background
                            backgroundColor: 'rgba(91, 91, 91, 0.2)', // Light gray with transparency
                            borderColor: 'rgba(91, 91, 91, 0.2)', // Match the border color to background
                            borderWidth: 2,  // Apply border width
                            barThickness: 25,  // Thicker base bar
                            stack: 'background',  // Ensures base is stacked behind
                            barPercentage: 1.0,
                            categoryPercentage: 1.0,
                            // Ensure this dataset is drawn first (behind other bars)
                            order: 1
                        },
                        {
                            // Actual bars (colored based on utilization)
                            label: 'Utilization (%)',
                            data: utilization,
                            backgroundColor: (ctx) => {
                                const index = ctx.dataIndex;
                                const util = utilization[index];
                                return util > 95 ? '#e42855' :
                                       util > 90 ? '#faae70' :
                                       util > 80 ? '#8da8fd' : '#90d67f';
                            },
                            borderColor: (ctx) => {
                                const index = ctx.dataIndex;
                                const util = utilization[index];
                                return util > 95 ? '#e42855' :
                                       util > 90 ? '#faae70' :
                                       util > 80 ? '#8da8fd' : '#90d67f';
                            },
                            borderWidth: 2,  // Apply border width
                            barThickness: 25,  // Thinner fill bar
                            stack: 'background',  // Ensures utilization is stacked on top of base
                            // Ensure this dataset is drawn last (on top of other bars)
                            order: 2
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',  // This makes the bar chart horizontal
                    scales: {
                        y: {
                            ticks: {
                                color: '#fff',  // Change y-axis label color to white
                                font: {
                                    size: 12  // Adjust the font size
                                },
                                
                            },
                            padding: {
                                bottom: 50  // Add padding to the bottom of the labels
                            },
                            stacked: false  // Do not stack the bars
                        },
                        x: {
                            ticks: {
                                color: '#fff',  // Change x-axis label color to white
                                font: {
                                    size: 12  // Adjust the font size
                                },
                                beginAtZero: true,
                                stepSize: 10,  // Set increments to 10
                                min: 0,        // Set minimum value
                                max: 100       // Set maximum value
                            },
                            stacked: false  // Ensure no stacking so bars overlay correctly
                        }
                    },
                    plugins: {
                        tooltip: {
                            backgroundColor: '#2a2a2a',  // Dark background for tooltip
                            borderColor: '#444',         // Border color for tooltip
                            borderWidth: 1,
                            titleFont: {
                                size: 10  // Tooltip title text size
                            },
                            bodyFont: {
                                size: 10  // Tooltip body text size
                            },
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `Utilization: ${tooltipItem.raw}%`;
                                }
                            }
                        },
                        legend: {
                            display: false  // Remove the legend
                        }
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 50,
                            bottom: 10
                        }
                    },
                    barPercentage: 0.8,
                    categoryPercentage: 0.8
                }
            });

        } else {
            console.error("Error fetching data.");
        }
    });
}

fetchNetworkUtilization();

function fetchNetworkMemory() {
    $.get("op/get_opWidgets.php").done(function (data) {
        if (data) {
            const chartData = [];
            const id = "10000003009";

            const widgetData = data[id][id]["WidgetData"];
            widgetData.forEach(device => {
                chartData.push({
                    displayName: device.displayName,
                    memory: parseFloat(device.value)
                });
            });

            // Sort the data to get the top 10 devices by memory
            chartData.sort((a, b) => b.memory - a.memory);
            const top10Data = chartData.slice(0, 10);

            const labels = top10Data.map(device => `${device.displayName}`);
            const memory = top10Data.map(device => device.memory);

            const ctx = document.getElementById('networkMemoryChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            // Base bars (light gray background)
                            label: 'Base Memory (%)',
                            data: Array(top10Data.length).fill(100),  // Full bar for background
                            backgroundColor: 'rgba(91, 91, 91, 0.2)', // Light gray with transparency
                            borderColor: 'rgba(91, 91, 91, 0.2)', // Match the border color to background
                            borderWidth: 2,  // Apply border width
                            barThickness: 20,  // Thicker base bar
                            stack: 'background',  // Ensures base is stacked behind
                            barPercentage: 1.0,
                            categoryPercentage: 1.0,
                            // Ensure this dataset is drawn first (behind other bars)
                            order: 1
                        },
                        {
                            // Actual bars (colored based on memory)
                            label: 'Memory (%)',
                            data: memory,
                            backgroundColor: (ctx) => {
                                const index = ctx.dataIndex;
                                const mem = memory[index];
                                return mem > 95 ? '#e42855' :
                                       mem > 90 ? '#faae70' :
                                       mem > 80 ? '#8da8fd' : '#90d67f';
                            },
                            borderColor: (ctx) => {
                                const index = ctx.dataIndex;
                                const mem = memory[index];
                                return mem > 95 ? '#e42855' :
                                       mem > 90 ? '#faae70' :
                                       mem > 80 ? '#8da8fd' : '#90d67f';
                            },
                            borderWidth: 2,  // Apply border width
                            barThickness: 20,  // Thinner fill bar
                            stack: 'background',  // Ensures memory is stacked on top of base
                            // Ensure this dataset is drawn last (on top of other bars)
                            order: 2
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',  // This makes the bar chart horizontal
                    scales: {
                        y: {
                            ticks: {
                                color: '#fff',  // Change y-axis label color to white
                                font: {
                                    size: 12  // Adjust the font size
                                },
                            },
                            padding: {
                                bottom: 50  // Add padding to the bottom of the labels
                            },
                            stacked: false  // Do not stack the bars
                        },
                        x: {
                            ticks: {
                                color: '#fff',  // Change x-axis label color to white
                                font: {
                                    size: 12  // Adjust the font size
                                },
                                beginAtZero: true,
                                stepSize: 10,  // Set increments to 10
                                min: 0,        // Set minimum value
                                max: 100       // Set maximum value
                            },
                            stacked: false  // Ensure no stacking so bars overlay correctly
                        }
                    },
                    plugins: {
                        tooltip: {
                            backgroundColor: '#2a2a2a',  // Dark background for tooltip
                            borderColor: '#444',         // Border color for tooltip
                            borderWidth: 1,
                            titleFont: {
                                size: 10  // Tooltip title text size
                            },
                            bodyFont: {
                                size: 10  // Tooltip body text size
                            },
                            callbacks: {
                                label: function (tooltipItem) {
                                    return `Memory: ${tooltipItem.raw}%`;
                                }
                            }
                        },
                        legend: {
                            display: false  // Remove the legend
                        }
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 50,
                            bottom: 10
                        }
                    },
                    barPercentage: 0.8,
                    categoryPercentage: 0.8
                }
            });

        } else {
            console.error("Error fetching data.");
        }
    });
}


fetchNetworkMemory();

function fetchServers() {
    $.get("op/get_opmanager.php").done(function (data) {
        var windowsDevices = [];
        var linuxDevices = [];
        var storageDevices = [];
        var dcDevices = [];
        var unknownDevices = [];

        if (data) {
            data.forEach((value) => {
                switch (value.category) {
                    case "Server":
                        windowsDevices.push(value);
                        break;
                    case "Linux":
                        linuxDevices.push(value);
                        break;
                    case "Storage":
                        storageDevices.push(value);
                        break;
                    case "DomainController":
                        dcDevices.push(value);
                        break;
                    case "Unknown":
                        unknownDevices.push(value);
                        break;
                    default:
                        console.log("Unknown Category:", value.category);
                        break;
                }
            });

            // Find the maximum count among all categories
            var maxCount = Math.max(
                windowsDevices.length,
                linuxDevices.length,
                storageDevices.length,
                dcDevices.length,
                unknownDevices.length
            );

            // Update HTML counts and progress bars if the length is greater than 0
            updateProgressBarAndCount("Windows", windowsDevices, maxCount);
            updateProgressBarAndCount("Linux", linuxDevices, maxCount);
            updateProgressBarAndCount("Storage", storageDevices, maxCount);
            updateProgressBarAndCount("DomainController", dcDevices, maxCount);
            updateProgressBarAndCount("Unknown", unknownDevices, maxCount);
        }
    });
}

function updateProgressBarAndCount(category, devices, maxCount) {
    var countElement = $(`.${category.toLowerCase()}Count`);
    var progressContainer = $(`#progress-${category}`).closest('.progress-container');

    if (devices.length > 0) {
        countElement.text(devices.length);
        updateServerProgressBar(category, devices, maxCount);
        progressContainer.show();
    } else {
        progressContainer.hide();
    }
}

function updateServerProgressBar(category, devices) {
    var progress = document.getElementById(`progress-${category}`);
    if (progress) {
        progress.innerHTML = ""; // Clear previous content

        // Count status occurrences
        var statusCounts = {
            "Clear": 0,
            "Trouble": 0,
            "Attention": 0,
            "Critical": 0
        };

        devices.forEach(device => {
            if (statusCounts.hasOwnProperty(device.statusStr)) {
                statusCounts[device.statusStr]++;
            }
        });

        console.log(`${category} - Counts:`, statusCounts);

        // Calculate total count for scaling
        var totalCount = devices.length;

        // Calculate percentage widths for each status
        var clearWidth = (statusCounts["Clear"] / totalCount) * 100;
        var troubleWidth = (statusCounts["Trouble"] / totalCount) * 100;
        var attentionWidth = (statusCounts["Attention"] / totalCount) * 100;
        var criticalWidth = (statusCounts["Critical"] / totalCount) * 100;

        // Create segments based on widths and colors
        if (clearWidth > 0) {
            var clearSegment = document.createElement("div");
            clearSegment.style.width = `${clearWidth}%`;
            clearSegment.style.backgroundColor = "#90d67f"; // Green for Clear
            clearSegment.className = "progress-segment";
            progress.appendChild(clearSegment);
        }
        if (troubleWidth > 0) {
            var troubleSegment = document.createElement("div");
            troubleSegment.style.width = `${troubleWidth}%`;
            troubleSegment.style.backgroundColor = "#faae70"; // Orange for Trouble
            troubleSegment.className = "progress-segment";
            progress.appendChild(troubleSegment);
        }
        if (attentionWidth > 0) {
            var attentionSegment = document.createElement("div");
            attentionSegment.style.width = `${attentionWidth}%`;
            attentionSegment.style.backgroundColor = "#8da8fd"; // Blue for Attention
            attentionSegment.className = "progress-segment";
            progress.appendChild(attentionSegment);
        }
        if (criticalWidth > 0) {
            var criticalSegment = document.createElement("div");
            criticalSegment.style.width = `${criticalWidth}%`;
            criticalSegment.style.backgroundColor = "#e42855"; // Red for Critical
            criticalSegment.className = "progress-segment";
            progress.appendChild(criticalSegment);
        }
    } else {
        console.log(`Progress bar not found for ${category}`);
    }
}

fetchServers();

function serverStatus() {
    $.get("op/get_opmanager.php").done(function (data) {
        // Initialize arrays for each status
        var clearDevices = [];
        var troubleDevices = [];
        var attentionDevices = [];
        var criticalDevices = [];

        // Process fetched data
        if (data) {
            data.forEach((value) => {
                if (["Server", "Linux", "DomainController", "Storage", "Unknown"].includes(value.category)) {
                    switch (value.statusStr) {
                        case "Clear":
                            clearDevices.push(value);
                            break;
                        case "Trouble":
                            troubleDevices.push(value);
                            break;
                        case "Attention":
                            attentionDevices.push(value);
                            break;
                        case "Critical":
                            criticalDevices.push(value);
                            break;
                        default:
                            console.log("Unknown Status");
                            break;
                    }
                }
            });
        }

        // Calculate total counts
        var clearCount = clearDevices.length;
        var troubleCount = troubleDevices.length;
        var attentionCount = attentionDevices.length;
        var criticalCount = criticalDevices.length;

        // Total count of all devices
        var totalCount = clearCount + troubleCount + attentionCount + criticalCount;

        // Data for the chart
        const chartData = {
            labels: ["Clear", "Trouble", "Attention", "Critical"],
            datasets: [
                {
                    label: "Devices",
                    data: [clearCount, troubleCount, attentionCount, criticalCount],
                    backgroundColor: ['#90d67f', '#faae70', '#8da8fd', '#e42855'],
                    hoverOffset: 7,
                },
            ],
        };

        // Configuration for the doughnut chart
        const config = {
            type: "doughnut",
            data: chartData,
            options: {
                responsive: true,
                cutout: "70%", // Adjust this value to make the sections smaller
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.label || "";
                                if (label) {
                                    label += ": ";
                                }
                                if (context.raw !== null) {
                                    label += context.raw;
                                }
                                return label;
                            },
                        },
                    },
                    datalabels: {
                        color: "#fff",
                        font: {
                            weight: "bold",
                        },
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map((data) => {
                                sum += data;
                            });
                            let percentage = ((value * 100) / sum).toFixed(2) + "%";
                            return percentage;
                        },
                    },
                },
            },
            plugins: [
                {
                    id: "centerText",
                    beforeDraw: function (chart) {
                        var width = chart.width,
                            height = chart.height,
                            ctx = chart.ctx;

                        ctx.restore();
                        var fontSize = (height / 90).toFixed(2);
                        ctx.font = `bold ${fontSize}em sans-serif`; // Set the font to bold
                        ctx.textBaseline = "middle";
                        ctx.fillStyle = "#9a9cae";

                        ctx.beginPath();
                        ctx.arc(width / 2, height / 2, Math.min(width, height) / 4, 0, 2 * Math.PI);
                        ctx.fillStyle = '#1d2231'; // Background color
                        ctx.fill();

                        ctx.fillStyle = '#fff'; // Text color
                        var text = totalCount,
                            textX = Math.round((width - ctx.measureText(text).width) / 2),
                            textY = height / 1.92;

                        ctx.fillText(text, textX, textY);
                        ctx.save();
                    },
                },
            ],
        };

        chartData.datasets.forEach((dataset) => {
            dataset.borderWidth = 4; // Adjust the width to create space between sections
            dataset.hoverBorderWidth = 5; // Ensure the hover border width matches
            dataset.borderColor = "#15171C"; // Set the border color to create visible gaps
            dataset.hoverBorderColor = "#15171C"; // Ensure the hover border color matches
        });

        // Initialize the chart
        const serverChart = new Chart(
            document.getElementById("server-doughnut-chart"),
            config
          );
    });
}

serverStatus();

function fetchRecentServerAlarms() {
    $.get("op/get_opAlerts.php").done(function (data) {
        if (data) {

            const allowedCategories = ["Linux", "Server", "Storage", "DomainController", "Unknown"];
            const allowedStatus = ["Critical", "Attention", "Trouble", "ServiceDown"];
            const filteredAlarms = data.filter(alarm => allowedCategories.includes(alarm.category));
            const alarmCount = data.filter(alarm => 
                allowedCategories.includes(alarm.category) && 
                allowedStatus.includes(alarm.statusStr)
            );

            $(".serverAlarmCount").text(alarmCount.length);

            const alarms = filteredAlarms.slice(0, 5); // Get only the first 5 alarms
            let criticalAlarmsFound = false;

            alarms.forEach(alarm => {
                let alertClass, borderClass, iconHtml, colorStyle, title;

                switch (alarm.statusStr) {
                    case 'Trouble':
                        alertClass = 'alert alert-subtle-warning';
                        borderClass = 'border-warning';
                        iconHtml = `<div class="d-flex align-items-center" role="alert">
                                        <span class="uil uil-exclamation-circle text-warning me-3 fs-5"></span>
                                    </div>`;
                        colorStyle = 'border-color: #faae70 !important; padding: 0.6rem;';
                        title = 'Trouble';
                        break;
                    case 'Critical':
                        alertClass = 'alert alert-subtle-danger';
                        borderClass = 'border-danger';
                        iconHtml = `<div class="d-flex align-items-center" role="alert">
                                        <span class="uil uil-times-circle text-danger me-3 fs-5"></span>
                                    </div>`;
                        colorStyle = 'border-color: #e42855 !important; padding: 0.6rem;';
                        title = 'Critical';
                        criticalAlarmsFound = true; // Set flag to true for critical alarm
                        break;
                    case 'Clear':
                        alertClass = 'alert alert-subtle-success';
                        borderClass = 'border-success';
                        iconHtml = `<div class="d-flex align-items-center" role="alert">
                                        <span class="uil uil-check-circle text-success me-3 fs-5"></span>
                                    </div>`;
                        colorStyle = 'border-color: #90d67f !important; padding: 0.6rem;';
                        title = 'Clear';
                        break;
                    case 'Attention':
                        alertClass = 'alert alert-subtle-primary';
                        borderClass = 'border-primary';
                        iconHtml = `<div class="d-flex align-items-center" role="alert">
                                        <span class="uil uil-info-circle text-primary me-3 fs-5"></span>
                                    </div>`;
                        colorStyle = 'border-color: #8da8fd !important; padding: 0.6rem;';
                        title = 'Attention';
                        break;
                    default:
                        return;
                }

                const alertDiv = `
                    <div class="alert ${alertClass} d-flex flex-column flex-sm-row w-80 border ${borderClass} border-2" style="${colorStyle}">
                        <!--begin::Icon-->
                        ${iconHtml}
                        <!--end::Icon-->
                        <!--begin::Content-->
                        <div class="d-flex flex-column mt-1">
                            <h6 class="mb-1">
                                ${alarm.displayName}<span class="badge badge-phoenix badge-phoenix-info rounded-pill fs-10 ms-2">
                                <span class="badge-label">${alarm.category}</span>
                                </span>
                            </h6>
                            <span style="font-size:12px">${alarm.message}</span>
                            <span style="font-size:12px">${alarm.modTime}</span>
                        </div>
                        <!--end::Content-->
                    </div>
                `;

                // Append to the main container
                $('#serverAlert-container').append(alertDiv);

                // Check if the alarm is in the allowed categories and allowed status
                if (allowedCategories.includes(alarm.category) && allowedStatus.includes(alarm.statusStr)) {
                    // Append to the critical container as well
                    $('#serverCritical-container').append(alertDiv);
                }
            });

            // Check if no critical alarms found
            if (!criticalAlarmsFound) {
                const noAlarmsDiv = `
                    <div class="alert alert-subtle-info d-flex flex-column flex-sm-row w-80 border border-info border-2 mb-0" style="border-color: #8da8fd !important; padding: 0.4rem;">
                        <div class="d-flex align-items-center" role="alert">
                            <span class="fas fa-face-smile-beam text-primary ms-2 me-3 fs-7"></span>
                        </div>
                        <div class="d-flex flex-column mt-1">
                            <h6 class="mb-1">No Critical Alarms Found</h6>
                        </div>
                    </div>
                `;
                $('#serverCritical-container').append(noAlarmsDiv);
            }

        } else {
            console.error("Error fetching data.");
        }
    });
}

fetchRecentServerAlarms();


function fetchServerUtilization() {
    $.get("op/get_opWidgets.php").done(function (data) {
        if (data) {
            const chartData = [];
            const id = "10000003036";

            const widgetData = data[id][id]["WidgetData"];
            widgetData.forEach(device => {
                chartData.push({
                    displayName: device.displayName,
                    utilization: parseFloat(device.value)
                });
            });

            // Sort the data to get the top 10 devices by availability
            chartData.sort((a, b) => b.utilization - a.utilization);
            const top10Data = chartData.slice(0, 10);

            const labels = top10Data.map(device => `${device.displayName}`);
            const utilization = top10Data.map(device => device.utilization);

            // Determine bar and border color based on availability
            const backgroundColors = utilization.map(util => {
                if (util > 95) return '#e42855'; // Red
                else if (util > 90) '#faae70'; // Orange
                else if (util > 80) '#8da8fd'; // Blue
                else return '#90d67f'; // Green
            });
            const borderColors = utilization.map(util => {
                if (util > 95) return '#e42855'; // Red
                else if (util > 90) '#faae70'; // Orange
                else if (util > 80) '#8da8fd'; // Blue
                else return '#90d67f'; // Green
            });

            const ctx = document.getElementById('serverUtilizationChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Utilization (%)',
                        data: utilization,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',  // This makes the bar chart horizontal
                    scales: {
                        y: {
                            ticks: {
                                color: 'white',  // Change y-axis label color to white
                                font: {
                                    size: 12,  // Adjust the font size
                                }    
                            }    
                        },
                        x: {
                            ticks: {
                                color: 'white',
                                font: {
                                    size: 12,  // Adjust the font size
                                }
                            },
                            beginAtZero: true,
                            max: 100
                        }
                    },
                    plugins: {
                        tooltip: {
                            titleFont: {
                                size: 10  // Tooltip title text size
                            },
                            bodyFont: {
                                size: 10  // Tooltip body text size  
                            }
                        },
                        legend: {
                            display: false  // Remove the legend
                        }
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        }
                    },
                    barPercentage: 0.6
                }
            });
            
        } else {
            console.error("Error fetching data.");
        }
    });
}

fetchServerUtilization();

function fetchServerAvailability() {
    $.get("op/get_opWidgets.php").done(function (data) {
        if (data) {
            const chartData = [];
            const id = "10000003034";

            const widgetData = data[id][id]["WidgetData"];
            widgetData.forEach(device => {
                chartData.push({
                    displayName: device.displayName,
                    ipAddress: device.ipAddress,
                    availability: parseFloat(device.availability),
                    unavailability: -1 * (100 - parseFloat(device.availability))  // Make unavailability negative
                });
            });

            // Sort the data to get the top 10 devices by availability
            chartData.sort((a, b) => b.availability - a.availability);
            const top10Data = chartData.slice(0, 10);

            const labels = top10Data.map(device => `${device.displayName}`);
            const availability = top10Data.map(device => device.availability);
            const unavailability = top10Data.map(device => device.unavailability);

            const ctx = document.getElementById('serverAvailabilityChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Availability (%)',
                            data: availability,
                            backgroundColor: '#90d67f', // Green for availability
                            borderColor: '#90d67f',
                            borderWidth: 1,
                            barThickness: 15  // Adjust this value to control bar thickness
                        },
                        {
                            label: 'Unavailability (%)',
                            data: unavailability,
                            backgroundColor: '#e42855', // Red for unavailability
                            borderColor: '#e42855',
                            borderWidth: 1,
                            barThickness: 15  // Adjust this value to control bar thickness
                        }
                    ]
                },
                options: {
                    indexAxis: 'y',  // This makes the bar chart horizontal
                    scales: {
                        y: {
                            ticks: {
                                color: 'white',  // Change y-axis label color to white
                                font: {
                                    size: 12  // Adjust the font size
                                }
                            },
                            stacked: true  // Stack the bars horizontally
                        },
                        x: {
                            ticks: {
                                color: 'white',  // Change x-axis label color to white
                                font: {
                                    size: 12  // Adjust the font size
                                },
                                beginAtZero: true,
                                stepSize: 10,  // Set increments to 10
                                min: -100,  // Set minimum value
                                max: 100    // Set maximum value
                            },
                            stacked: true  // Stack the bars horizontally
                        }
                    },
                    plugins: {
                        tooltip: {
                            titleFont: {
                                size: 10  // Tooltip title text size
                            },
                            bodyFont: {
                                size: 10  // Tooltip body text size
                            }
                        },
                        legend: {
                            display: true  // Show the legend
                        }
                    },
                    barPercentage: 0.4,
                    categoryPercentage: 0.6
                }
            });

        } else {
            console.error("Error fetching data.");
        }
    });
}

fetchServerAvailability();


fetchServerAvailability();

function fetchServerMemory() {
    $.get("op/get_opWidgets.php").done(function (data) {
        if (data) {
            const chartData = [];
            const id = "10000003037";

            const widgetData = data[id][id]["WidgetData"];
            widgetData.forEach(device => {
                chartData.push({
                    displayName: device.displayName,
                    memory: parseFloat(device.value)
                });
            });

            // Sort the data to get the top 10 devices by availability
            chartData.sort((a, b) => b.memory - a.memory);
            const top10Data = chartData.slice(0, 10);

            const labels = top10Data.map(device => `${device.displayName}`);
            const memory = top10Data.map(device => device.memory);

            // Determine bar and border color based on availability
            const backgroundColors = memory.map(mem => {
                if (mem > 95) return '#e42855'; // Red
                else if (mem > 90) return '#faae70'; // Orange
                else if (mem > 80) return '#8da8fd'; // Blue
                else return '#90d67f'; // Green
            });
            const borderColors = memory.map(mem => {
                if (mem > 95) return '#e42855'; // Red
                else if (mem > 90) return '#faae70'; // Orange
                else if (mem > 80) return '#8da8fd'; // Blue
                else return '#90d67f'; // Green
            });

            const ctx = document.getElementById('serverMemoryChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Memory (%)',
                        data: memory,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',  // This makes the bar chart horizontal
                    scales: {
                        y: {
                            ticks: {
                                color: 'white',  // Change y-axis label color to white
                                font: {
                                    size: 12,  // Adjust the font size
                                }    
                            }    
                        },
                        x: {
                            ticks: {
                                color: 'white',
                                font: {
                                    size: 12,  // Adjust the font size
                                }
                            },
                            beginAtZero: true,
                            max: 100
                        }
                    },
                    plugins: {
                        tooltip: {
                            titleFont: {
                                size: 10  // Tooltip title text size
                            },
                            bodyFont: {
                                size: 10  // Tooltip body text size  
                            }
                        },
                        legend: {
                            display: false  // Remove the legend
                        }
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        }
                    },
                    barPercentage: 0.6
                }
            });
            
        } else {
            console.error("Error fetching data.");
        }
    });
}

fetchServerMemory();

function fetchDiskUtilization() {
    $.get("op/get_opWidgets.php").done(function (data) {
        if (data) {
            const id = "10000003042";
            const widgetData = data[id][id]["WidgetData"];

            if (widgetData) {
                var tableBody = document.querySelector(".diskUtilization");
                tableBody.innerHTML = ""; // Clear the table body before appending new data

                widgetData.forEach((device) => {
                    var deviceName = device.displayName;
                    var disk = parseFloat(device.value);
                    var volume = device.volume;

                    var row = document.createElement("tr");

                    var deviceCell = document.createElement("td");
                    deviceCell.className = "min-w-100px";
                    deviceCell.textContent = deviceName;
                    row.appendChild(deviceCell);

                    var volumeCell = document.createElement("td");
                    volumeCell.className = "text-start min-w-100px";
                    volumeCell.textContent = volume;
                    row.appendChild(volumeCell);

                    var diskCell = document.createElement("td");
                    diskCell.className = "text-start min-w-100px";

                    var progressBar = document.createElement("div");
                    progressBar.className = "progress";
                    progressBar.style.position = 'relative'; // Ensure progress bar is the relative container
                    progressBar.style.height = '25px'; // Set the height of the progress bar

                    var progressBarFill = document.createElement("div");
                    progressBarFill.className = "progress-bar";
                    progressBarFill.style.width = `${disk}%`;
                    progressBarFill.style.height = '100%'; // Ensure fill height matches the progress bar height
                    progressBar.style.textContent = `${disk}%`

                    if (disk > 95) {
                        progressBarFill.classList.add("bg-danger"); // Red
                    } else if (disk > 90) {
                        progressBarFill.style.backgroundColor = '#faae70'; // Orange
                    } else if (disk > 80) {
                        progressBarFill.classList.add("bg-primary"); // Blue
                    } else {
                        progressBarFill.style.backgroundColor = '#90d67f'; // Green
                    }

                    var percentageSpan = document.createElement("span");
                    percentageSpan.className = "percentage-text";
                    percentageSpan.style.position = 'absolute';
                    percentageSpan.style.left = '50%';
                    percentageSpan.style.top = '50%';
                    percentageSpan.style.transform = 'translate(-50%, -50%)';
                    percentageSpan.style.color = 'black';
                    percentageSpan.style.fontWeight = 'bold';
                    percentageSpan.style.fontSize = 'larger';
                    percentageSpan.textContent = `${disk}%`;

                    progressBarFill.appendChild(percentageSpan);
                    progressBar.appendChild(progressBarFill);
                    diskCell.appendChild(progressBar);
                    row.appendChild(diskCell);

                    tableBody.appendChild(row);
                });
            } else {
                console.error("diskUtilization is null or undefined");
            }
        } else {
            console.error("Error fetching data.");
        }
    });
}

fetchDiskUtilization();
