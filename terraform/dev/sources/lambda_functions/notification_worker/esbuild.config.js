import * as esbuild from "esbuild"

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/index.js",
  platform: "node",
  target: "node20",
  format: "esm",
  minify: true,
  sourcemap: true,
  external: [],
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`
  }
})

console.log("Build completed successfully!")
