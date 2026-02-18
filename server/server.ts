import dotenv from "dotenv";
import app from "./src/app.ts";
import { checkDatabaseConnection } from "./src/shared/config/database.ts";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await checkDatabaseConnection();

  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });
};

startServer();
