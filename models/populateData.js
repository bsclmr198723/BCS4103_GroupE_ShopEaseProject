const { Pool } = require("pg");
const faker = require("faker");
const pool = require("../config/db");

async function populateData() {
  try {
    // Create products table if not exists
    await createProductTable();

    // Generate and insert sample data into products table
    const productsToInsert = 10000;

    await pool.query("BEGIN");

    for (let i = 0; i < productsToInsert; i++) {
      const name = faker.commerce.productName();
      const description = faker.lorem.sentence();
      const price = faker.datatype.number({ min: 10, max: 1000 });

      const insertQuery = {
        text: `INSERT INTO products (name, description, price) VALUES ($1, $2, $3)`,
        values: [name, description, price],
      };

      await pool.query(insertQuery);
    }

    await pool.query("COMMIT");
    console.log(`${productsToInsert} products inserted successfully.`);
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error populating data:", error);
  }
}
async function createProductTable() {
  const queryText = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price NUMERIC(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log("Product table created successfully");
  } catch (error) {
    console.error("Error creating product table", error);
  }
}

populateData()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error populating data:", err);
    process.exit(-1);
  });
