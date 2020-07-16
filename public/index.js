async function ajax(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.addEventListener("load", function () {
      try {
        resolve(this.responseText);
      } catch (error) {
        reject(error);
      }
    });
    request.open("GET", url);
    request.send();
    request.addEventListener("error", reject);
  });
}
let socket;
/** @returns {void} */
async function main() {
  // call sample API
  document.getElementById("random-number").innerText = await ajax("/random");
}
main();

function renderData(sd) {
  data.rows.push([data.rows.length, sd]);
  chart.data(data);
  //chart.draw();
}

function disconnect() {
  socket.disconnect();
}
function connect() {
  socket = io("/my-namespace");
  socket.on("connect", () =>
    socket.emit("hello", `Hi there! I am ${window.navigator.userAgent}`)
  );

  const secondsElement = document.getElementById("seconds");
  socket.on(
    "seconds",
    (seconds) => (secondsElement.innerText = seconds.toString())
  );

  const welcomeElement = document.getElementById("welcome");
  socket.on(
    "online",
    (online) => (onlineElement.innerText = online.toString())
  );
  socket.on("greetings", (msj) => alert(msj));
  socket.on("onDataRead", (data) => renderData(data));

  const onlineElement = document.getElementById("online");
  socket.on(
    "welcome",
    (welcomeMessage) => (welcomeElement.innerText = welcomeMessage)
  );

  socket.on("disconnect", () => {
    onlineElement.innerText = "";
    data.rows = [];
    chart.data(data);
  });
}
var chart;
var data;
anychart.onDocumentReady(function () {
  // the data
  data = {
    rows: [],
  };
  // create the chart
  chart = anychart.column();
  // add the data
  chart.title("The deadliest earthquakes in the XXth century");
  chart.container("container");
  chart.draw();
});
