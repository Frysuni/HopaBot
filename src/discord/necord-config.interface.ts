import type { NecordModuleOptions } from "necord";

export interface NecordConfigInterface {
  createNecordOptions(): NecordModuleOptions | Promise<NecordModuleOptions>
}