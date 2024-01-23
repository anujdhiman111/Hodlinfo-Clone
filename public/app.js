document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndDisplayStoredData();
});

async function fetchDataAndDisplayStoredData() {
  try {
    // const response = await fetch("http://localhost:5000/fetchAndStoreData");
    // const data = await response.json();
    // const dataArray = Object.keys(data).map((pair) => {
    //   const { name, last, buy, sell, volume, base_unit } = data[pair];
    //   return { name, last, buy, sell, volume, base_unit };
    // });

    // const top10Results = dataArray.slice(0, 10);

    // await storeDataOnServer(top10Results);

    const storedDataResponse = await fetch(
      "http://localhost:5000/fetchandDisplayData"
    );
    const storedData = await storedDataResponse.json();
    displayData(storedData);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Function for Storing data in Postgres Database (Commented the code so that it don't run again)

// async function storeDataOnServer(data) {
//   try {
//     await fetch("http://localhost:5000/storeData", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//   } catch (error) {
//     console.error("Error storing data on the server:", error.message);
//   }
// }

function displayData(data) {
  const sumOfLast = data.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue.last);
  }, 0);

  const averageOfLast = parseInt(sumOfLast / data.length);
  document.getElementById("bestPrice").innerText = averageOfLast;

  const dropdown = `
    <select id="selectCurrency">
      ${data.map(
        (entry, idx) =>
          `<option id = ${idx} value=${entry.base_unit.toUpperCase()}>${entry.base_unit.toUpperCase()}</option>`
      )}
      </select>
  `;

  const tableHTML = `
    <table>
        <thead>
            <tr>
                <th class = "fillColorGrey">#</th>
                <th class = "fillColorGrey">Name</th>
                <th class = "fillColorGrey">Last</th>
                <th class = "fillColorGrey">Buy / Sell</th>
                <th class = "fillColorGrey">Volume</th>
                <th class = "fillColorGrey">Base_Unit</th>
            </tr>
        </thead>
        <tbody>
            ${data
              .map(
                (entry, index) => `
                    <tr>
                    <td>${index + 1}</td>
                    <td>${entry.name}</td>
                    <td>&#8377;${entry.last}</td>
                    <td>&#8377;${entry.buy} / &#8377;${entry.sell}</td>
                    <td>${entry.volume}</td>
                    <td>${entry.base_unit.toUpperCase()}</td>
                    </tr>
                `
              )
              .join("")}
        </tbody>
    </table>
  `;

  const currencyDropdown = document.getElementById("currencyDropdown");
  currencyDropdown.innerHTML = dropdown;
  const dataDisplay = document.getElementById("dataDisplay");
  dataDisplay.innerHTML = tableHTML;
}
