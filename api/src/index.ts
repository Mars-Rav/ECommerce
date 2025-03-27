import express, { Router, json, urlencoded } from "express";
import productsRouter from "./routes/products/routes";
import usersRouter from "./routes/users/routes";

const PORT = 5000;
const app = express();
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/products", productsRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
