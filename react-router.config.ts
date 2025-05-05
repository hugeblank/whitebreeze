import type { Config } from "@react-router/dev/config";

declare module "react-router" {
  interface Future {
    unstable_middleware: true;
  }
}

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  future: {
    unstable_middleware: true,
    unstable_splitRouteModules: true,
    unstable_optimizeDeps: true,
    unstable_viteEnvironmentApi: true,
    unstable_subResourceIntegrity: true,
  },
  // Uncomment these if you want to prerender your routes
  // serverBuildFile: "assets/server-build.js",
  // prerender: ["/"],
} satisfies Config;
