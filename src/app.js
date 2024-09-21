import cors from "cors";
import express from "express";
import router from "./app/routes/index.js";
import clientErrorHandler from "./app/middlewares/globalErrorHandler.js";
import { specs, swaggerUi } from "./shared/swagger.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(clientErrorHandler);

export default app;
