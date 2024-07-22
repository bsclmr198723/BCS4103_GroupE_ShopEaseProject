const db = require("../config/db");

const createProductTable = async () => {
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
    await db.query(queryText);
    console.log("Product table created successfully");
  } catch (error) {
    console.error("Error creating product table", error);
  }
};

createProductTable();

module.exports = {
  async getAll() {
    const res = await db.query("SELECT * FROM products");
    return res.rows;
  },

  async getById(id) {
    const res = await db.query("SELECT * FROM products WHERE id = $1", [id]);
    return res.rows[0];
  },

  async create(product) {
    const { name, description, price } = product;
    const res = await db.query(
      "INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *",
      [name, description, price]
    );
    return res.rows[0];
  },

  async update(id, product) {
    const { name, description, price } = product;
    const res = await db.query(
      "UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
      [name, description, price, id]
    );
    return res.rows[0];
  },

  async delete(id) {
    await db.query("DELETE FROM products WHERE id = $1", [id]);
    return { message: "Product deleted successfully" };
  },
};
