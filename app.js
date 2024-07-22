const express = require('express');
const productRoutes = require('./routes/productRoutes');
const swaggerDocs = require("./docs/swagger");
require('dotenv').config();

const app = express();
swaggerDocs(app);
app.use(express.json());

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
