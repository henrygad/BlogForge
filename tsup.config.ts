import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/server.ts", "src/cli.ts"],
    outDir: "dist",
    target: "node20",
    format: ["esm"],
    clean: true,
    sourcemap: true,
    dts: false,
    splitting: false,
    minify: false,
});
