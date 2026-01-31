import type { PenguinPluginApi } from "penguin/plugin-sdk";
import { emptyPluginConfigSchema } from "penguin/plugin-sdk";

import { createDiagnosticsOtelService } from "./src/service.js";

const plugin = {
  id: "diagnostics-otel",
  name: "Diagnostics OpenTelemetry",
  description: "Export diagnostics events to OpenTelemetry",
  configSchema: emptyPluginConfigSchema(),
  register(api: PenguinPluginApi) {
    api.registerService(createDiagnosticsOtelService());
  },
};

export default plugin;
