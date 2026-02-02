import { loadEnv } from "./env";
import { constants } from "./constants";

export const config = {
  env: loadEnv(),
  constants,
};
