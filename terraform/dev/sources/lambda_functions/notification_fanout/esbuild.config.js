import * as esbuild from "esbuild"

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/index.js",
  platform: "node",
  target: "node22",
  format: "cjs",
  minify: true,
  sourcemap: true,
  external: []
})

console.log("Build completed successfully!")
