import express, { Router, json, urlencoded } from "express";
import productsRouter from "./routes/products/routes";

const PORT = 5000;
const app = express();
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
