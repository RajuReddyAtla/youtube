import app from "@/app";
import { logger } from "@utils/logger";
import { NODE_ENV, PORT } from "@config";
import validateEnv from "@utils/validateEnv";
validateEnv();
// ROUTES
// import connectDatabase from "./databases";
import HomeRoute from "@routes/index.route";
 
const routes = [
  {
    path: "/",
    func: HomeRoute,
  },
];

routes.forEach(({ path, func }) => {
  app.use(path, func);
});

// connectDatabase();
app.listen(PORT, () => {
  logger.info(`======= ENV: ${NODE_ENV} =======`);
  logger.info(`🚀 App listening on the port http://localhost:${PORT}`);
});
