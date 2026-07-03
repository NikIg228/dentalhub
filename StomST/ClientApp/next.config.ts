import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import path from "path";

const createNextConfig = (phase: string): NextConfig => {
  const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    reactStrictMode: true,
    devIndicators: false,
    distDir: isDevServer ? ".next-dev" : ".next-build",
    output: "export",
    trailingSlash: true,
    images: {
      unoptimized: true
    },
    outputFileTracingRoot: path.join(__dirname)
  };
};

export default createNextConfig;
