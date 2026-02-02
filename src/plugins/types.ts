import { constants } from "../config/constants";
import { Env } from "../config/env";

export type Config = {
  env: Env;
  constants: typeof constants;
};
