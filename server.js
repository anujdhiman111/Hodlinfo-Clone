const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 5000;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "12345678",
  port: 5432,
});
client.connect();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.get("/fetchAndStoreData", async (req, res) => {
  try {
    const response = await fetch("https://api.wazirx.com/api/v2/tickers");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data from external API:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/storeData", async (req, res) => {
  try {
    const frontendData = req.body;

    await storeDataInDatabase(frontendData);

    isDataFetched = true;

    res.status(200).json({ message: "Data stored in the database." });
  } catch (error) {
    console.error("Error storing data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/fetchandDisplayData", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM wazirx_data");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function storeDataInDatabase(data) {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS wazirx_data (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        last NUMERIC,
        buy NUMERIC,
        sell NUMERIC,
        volume NUMERIC,
        base_unit VARCHAR(50)
      );
    `);

    for (const result of data) {
      const { name, last, buy, sell, volume, base_unit } = result;

      await client.query(
        `
        INSERT INTO wazirx_data (name, last, buy, sell, volume, base_unit)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [name, last, buy, sell, volume, base_unit]
      );
    }

    console.log("Data stored in the database.");
  } catch (error) {
    console.error("Error storing data in the database:", error.message);
  }
}
