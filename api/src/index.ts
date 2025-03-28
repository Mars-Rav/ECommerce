import express, { Router, json, urlencoded } from "express";
import productsRouter from "./routes/products/routes.js";
import usersRouter from "./routes/users/routes.js";
import ordersRouter from "./routes/orders/routes.js";

const app = express();
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/orders", ordersRouter);

if (process.env.NODE_ENV == "dev") {
  app.listen(process.env.PORT_NUMBER, () => {
    console.log(`Server listening on port ${process.env.PORT_NUMBER}...`);
  });
}
