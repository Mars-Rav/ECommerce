import express from "express";

const PORT = 5000;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World, how are you?");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
