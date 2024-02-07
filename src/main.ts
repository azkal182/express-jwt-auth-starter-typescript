
import { web } from "./application/web";
import { logger } from "./application/logging";

const port = process.env.PORT || 3000;

web.listen(3000, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`);
});
