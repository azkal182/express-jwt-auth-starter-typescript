import { web } from "./application/web";
import { logger } from "./application/logging";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;
web.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
});
