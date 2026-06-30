import { defineConfig } from "tsup";
import { baseConfig } from "../../shared/tsup.base";

export default defineConfig({
  ...baseConfig,
  entry: {
    index: "src/index.ts",
    "components/index": "src/components.ts",
  },
});
