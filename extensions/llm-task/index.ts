import type { PenguinPluginApi } from "../../src/plugins/types.js";

import { createLlmTaskTool } from "./src/llm-task-tool.js";

export default function register(api: PenguinPluginApi) {
  api.registerTool(createLlmTaskTool(api), { optional: true });
}
