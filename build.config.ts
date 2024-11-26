import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/main.ts"],

  rollup: {
    esbuild: {
      target: "esnext",
    },
  },
});
