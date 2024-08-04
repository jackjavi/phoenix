function fetchServiceDeskData() {
  $.get("op/get_servicedesk.php").done(function (tickets) {
    if (tickets) {
      var statusData = tickets.statusTickets;
      var priorityData = tickets.priorityTickets;

      var openTickets = statusData["Open"].list_info.total_count;
      var closedTickets = statusData["Closed"].list_info.total_count;
      var onholdTickets = statusData["Onhold"].list_info.total_count;
      var resolvedTickets =
        statusData["Resolved"].list_info.total_count;

      var urgentTickets =
        priorityData["Urgent"].list_info.total_count;
      var highTickets = priorityData["High"].list_info.total_count;
      var mediumTickets =
        priorityData["Medium"].list_info.total_count;
      var lowTickets = priorityData["Low"].list_info.total_count;

      var totalTickets =
        openTickets + closedTickets + onholdTickets + resolvedTickets;

      $(".openTicketsCount").text(openTickets);
      $(".closedTicketsCount").text(closedTickets);
      $(".onholdTicketsCount").text(onholdTickets);
      $(".resolvedTicketsCount").text(resolvedTickets);

      $(".urgentTickets").text(urgentTickets);
      $(".highTickets").text(highTickets);
      $(".mediumTickets").text(mediumTickets);
      $(".lowTickets").text(lowTickets);
      $(".totalTickets").text("Total of " + totalTickets + " Tickets this year");
    } else {
      console.error("Error fetching data.");
    }

    const data = {
      labels: ["Urgent", "High", "Medium", "Low"],
      datasets: [
        {
          label: "Tickets",
          data: [urgentTickets, highTickets, mediumTickets, lowTickets],
          backgroundColor: ["#e42855", "#faae70", "#8da8fd", "#90d67f"],
          hoverOffset: 7,
        },
      ],
    };

    // Configuration for the doughnut chart
    const config = {
      type: "doughnut",
      data: data,
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
                    var text = openTickets,
                        textX = Math.round((width - ctx.measureText(text).width) / 2),
                        textY = height / 1.92;
        
                    ctx.fillText(text, textX, textY);
                    ctx.save();

            var text = openTickets,
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 1.92;

            ctx.fillText(text, textX, textY);
            ctx.save();
          },
        },
      ],
    };

    data.datasets.forEach((dataset) => {
      dataset.borderWidth = 4; // Adjust the width to create space between sections
      dataset.hoverBorderWidth = 5; // Ensure the hover border width matches
      dataset.borderColor = "#15171C"; // Set the border color to create visible gaps
      dataset.hoverBorderColor = "#15171C"; // Ensure the hover border color matches
    });

    const ticketChart = new Chart(
      document.getElementById("ticketChart"),
      config
    );
  });
}

fetchServiceDeskData();

function fetchRecentTickets() {
  $.get("op/get_servicedesk.php").done(function (data) {
    if (data) {
      var recentTickets = data.recentTickets.requests;

      if (recentTickets) {
        var tableBody = document.querySelector(".recentTickets");
        tableBody.innerHTML = ''; // Clear the table body first

        recentTickets.forEach((ticket, index) => {
          var ticketTitle = ticket.template.name;
          var ticketID = ticket.id;
          var technician = ticket.technician ? ticket.technician.name : "Not Assigned";
          var priority = ticket.priority ? ticket.priority.name : "Not Assigned"; 
          var status = ticket.status.name;

          var row = document.createElement("tr");

          // Ticket ID
          var ticketIdCell = document.createElement("td");
          ticketIdCell.className = "white-space-nowrap ps-0";
          ticketIdCell.style.width = "15%";
          ticketIdCell.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="d-flex align-items-center">
                  <p class="mb-0 mt-1 ps-6 text-primary fw-bold fs-9">${ticketID}</p>
                </div>
            </div>
          `;
          row.appendChild(ticketIdCell);

          // Ticket Title
          var ticketCell = document.createElement("td");
          ticketCell.className = "align-middle";
          ticketCell.style.width = "10%";
          ticketCell.innerHTML = `<p class="fs-9 mb-0">${ticketTitle}</p>`;

          row.appendChild(ticketCell);

          // Priority
          var priorityCell = document.createElement("td");
          priorityCell.className = "align-middle fs-9 fw-bold";

          if (priority == "Urgent") {
            priorityCell.textContent = priority;
            //row.style.backgroundColor = "#ff000075";
            priorityCell.style.color = "#e42855";
            row.appendChild(priorityCell);
          } else if (priority == "High") {
            priorityCell.textContent = priority;
            priorityCell.style.color = "#faae70";
            row.appendChild(priorityCell);
          } else if (priority == "Medium") {
            priorityCell.textContent = priority;
            priorityCell.style.color = "#8da8fd";
            row.appendChild(priorityCell);
          } else if (priority == "Low") {
            priorityCell.textContent = priority;
            priorityCell.style.color = "#90d67f";
            row.appendChild(priorityCell);
          } else {
            priorityCell.textContent = priority;
            priorityCell.style.color = "#e42855";
            row.appendChild(priorityCell);
          }

          // Technician
          var technicianCell = document.createElement("td");
          technicianCell.className = "align-middle";
          technicianCell.style.width = "20%";
          technicianCell.innerHTML = `<p class="fs-9 mb-0">${technician}</p>`;
          row.appendChild(technicianCell);

          // Status
          var statusCell = document.createElement("td");
          statusCell.className = "align-middle text-end";
          statusCell.style.width = "15%";
          if (status == "Open") {
            statusCell.innerHTML = `<h6 class="mb-0 text-center"><span class="badge py-2 px-3 fs-10 badge badge-phoenix badge-phoenix-success rounded-pill badge-success">${status}</span></h6>`;
          } else if (status == "Closed") {
            statusCell.innerHTML = `<h6 class="mb-0 text-center"><span class="badge py-2 px-3 fs-10 badge badge-phoenix badge-phoenix-danger rounded-pill badge-danger"${ticketTitle === "Report an Incident" || priority == "Urgent" ? "badge-pheonix-dark" : "badge-pheonix-danger"}">${status}</span></h6>`;
          } else if (status == "Resolved") {
            statusCell.innerHTML = `<h6 class="mb-0 text-center"><span class="py-2 px-3 fs-10 badge badge-phoenix badge-phoenix-primary rounded-pill badge-primary">${status}</span></h6>`;
          } else {
            statusCell.innerHTML = `<h6 class="mb-0 text-center"><span class="py-2 px-3 fs-10 badge badge-phoenix badge-phoenix-warning rounded-pill badge-warning">${status}</span></h6>`;
          }
          row.appendChild(statusCell);

          tableBody.appendChild(row);
        });
      } else {
        console.error("recentTickets is null or undefined");
      }
    } else {
      console.error("Error fetching data.");
    }
  });
}

fetchRecentTickets();

function fetchDevices() {
  $.get("op/get_opmanager.php").done(function (data) {
    var wirelessDevices = [];
    var switchDevices = [];
    var routerDevices = [];
    var firewallDevices = [];
    var windowsDevices = [];
    var linuxDevices = [];
    var storageDevices = [];
    var dcDevices = [];
    var unknownDevices = [];

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
            console.log("Unknown Category");
            break;
        }
      });

      // Find the maximum count among all categories
      var maxCount = Math.max(
        wirelessDevices.length,
        switchDevices.length,
        routerDevices.length,
        firewallDevices.length,
        windowsDevices.length,
        linuxDevices.length,
        storageDevices.length,
        dcDevices.length,
        unknownDevices.length
      );

      // Update HTML counts and progress bars if the length is greater than 0
      updateDevicesProgressAndCount("Wireless", wirelessDevices, maxCount);
      updateDevicesProgressAndCount("Switch", switchDevices, maxCount);
      updateDevicesProgressAndCount("Router", routerDevices, maxCount);
      updateDevicesProgressAndCount("Firewall", firewallDevices, maxCount);
      updateDevicesProgressAndCount("Windows", windowsDevices, maxCount);
      updateDevicesProgressAndCount("Linux", linuxDevices, maxCount);
      updateDevicesProgressAndCount("Storage", storageDevices, maxCount);
      updateDevicesProgressAndCount("DomainController", dcDevices, maxCount);
      updateDevicesProgressAndCount("Unknown", unknownDevices, maxCount);
    }
  });
}

// Function to update progress bar dynamically based on max count
function updateDevicesProgressAndCount(category, devices, maxCount) {
  var countElement = $(`.${category.toLowerCase()}Count`);
  var progressContainer = $(`#progress-${category}`).closest('.progress-container');

  if (devices.length > 0) {
      countElement.text(devices.length);
      updateDevicesProgressBar(category, devices, maxCount);
      progressContainer.show();
  } else {
      progressContainer.hide();
  }
}

// Function to update progress bar segments based on device status
function updateDevicesProgressBar(category, devices, maxCount) {
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

fetchDevices();

function DeviceStatus() {
  $.get("op/get_opmanager.php").done(function (data) {
      // Initialize arrays for each status
      var clearDevices = [];
      var troubleDevices = [];
      var attentionDevices = [];
      var criticalDevices = [];

      // Process fetched data
      if (data) {
          data.forEach((value) => {
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
          document.getElementById("device-doughnut-chart"),
          config
      );
  });
}

DeviceStatus();

function fetchRecentAlarms() {
  $.get("op/get_opAlerts.php").done(function (data) {
      if (data) {
          const allowedCategories = ["Linux", "Server", "Storage", "DomainController", "Unknown", "Wireless", "Router", "Switch", "Firewall"];
          const allowedStatus = ["Critical", "Attention", "Trouble", "ServiceDown"];
          const filteredAlarms = data.filter(alarm => 
              allowedCategories.includes(alarm.category) && 
              allowedStatus.includes(alarm.statusStr)
          );

          $(".allAlarmCount").text(filteredAlarms.length);

          const alarms = filteredAlarms.slice(0, 5); // Get only the first 5 alarms

          alarms.forEach(alarm => {
              let alertClass, borderClass, iconHtml, colorStyle, title;

              switch (alarm.statusStr) {
                  case 'Trouble':
                      alertClass = 'alert alert-subtle-warning';
                      borderClass = 'border-warning';
                      iconHtml = `<div class="d-flex align-items-center" role="alert">
                       <span class="uil uil-exclamation-circle text-warning me-3 fs-5"></span> </div>`;
                      colorStyle = 'border-color: #faae70 !important; padding: 0.6rem;';
                      title = 'Trouble';
                      break;
                  case 'Critical':
                      alertClass = 'alert alert-subtle-danger';
                      borderClass = 'border-danger';
                      iconHtml = `<div class="d-flex align-items-center" role="alert">
                       <span class="uil uil-times-circle text-danger me-3 fs-5"></span> </div>`;
                      colorStyle = 'border-color: #e42855 !important; padding: 0.6rem;';
                      title = 'Critical';
                      break;
                  case 'Attention':
                     alertClass = 'alert alert-subtle-primary';
                      borderClass = 'border-primary';
                      iconHtml = `<div class="d-flex align-items-center" role="alert">
                       <span class="uil uil-info-circle text-primary me-3 fs-5"></span> </div>`;
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
                          <span style="font-size:12px">${alarm.modTime}</span>
                      </div>
                      <!--end::Content-->
                  </div>
              `;

              $('#allAlert-container').append(alertDiv);
          });

          // Check if no critical alarms found
          if (filteredAlarms.length == 0) {
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
            $('#allAlert-container').append(noAlarmsDiv);
        }

      } else {
          console.error("Error fetching data.");
      }
  })
}

fetchRecentAlarms();

function getContracts() {
  $.get("op/get_servicedesk.php").done(function (data) {
    if (data) {
      var recentContracts = data.contracts;
      var currentDate = new Date().getTime();
      var next90Days = currentDate + 90 * 24 * 60 * 60 * 1000;
      var last30Days = currentDate - 30 * 24 * 60 * 60 * 1000;

      recentContracts.contracts.forEach(contract => {
        let toDate = parseInt(contract.to_date.value);

        if ((toDate <= next90Days && toDate >= currentDate) || (toDate < currentDate && toDate >= last30Days)) {
          let alertClass, borderClass, iconHtml, colorStyle, title, badgeClass, daysUntilExpiration;

          switch (contract.status.status) {
            case 'Active':
              daysUntilExpiration = Math.ceil((toDate - currentDate) / (1000 * 60 * 60 * 24));
              alertClass = 'alert alert-subtle-primary';
              borderClass = 'border-primary';
              iconHtml = `<div class="d-flex align-items-center" role="alert">
                <span class="fas fa-file-contract text-primary me-3 fs-5"></span> </div>`;
              colorStyle = 'border-color: #8da8fd !important; padding: 0.6rem;';
              title = 'Active';
              badgeClass = 'badge-phoenix-info';
              break;
            case 'Expired':
              alertClass = 'alert alert-subtle-danger';
              borderClass = 'border-danger';
              iconHtml = `<div class="d-flex align-items-center" role="alert">
                <span class="fas fa-file-excel text-danger me-3 fs-5"></span> </div>`;
              colorStyle = 'border-color: #e42855 !important; padding: 0.6rem;';
              title = 'Expired';
              badgeClass = 'badge-phoenix-warning'; // Change the badge color to yellow for expired contracts
              break;
            default:
              return; 
          }

          const alertDiv = `
            <div class="alert ${alertClass} d-flex flex-column flex-sm-row w-80 border ${borderClass} border-2" style="${colorStyle}; position: relative;">
                <!--begin::Icon-->
                ${iconHtml}
                <!--end::Icon-->
                <!--begin::Content-->
                <div class="d-flex flex-column mt-1">
                    <h6 class="mb-1">
                        ${contract.name}
                        <span class="badge badge-phoenix ${badgeClass} rounded-pill fs-10 ms-2">
                            <span class="badge-label">${contract.status.status}</span>
                        </span>
                    </h6>
                    <span style="font-size:12px">${contract.to_date.display_value}</span>
                </div>
                <!--end::Content-->
                ${contract.status.status === 'Active' ? `<span style="font-size:12px; position: absolute; right: 10px; top: 50%; transform: translateY(-50%); margin-top: 13px;">Expires in ${daysUntilExpiration} days</span>` : ''}
            </div>
          `;

          $('#contract-container').append(alertDiv);
        }
      });
    } else {
      console.error("Error fetching data.");
    }
  });
}


getContracts();