import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = 3000;

//middlewares
app.use(express.json());

//auth routes
app.use(authRoutes);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
