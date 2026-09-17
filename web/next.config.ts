import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@hyperlane-xyz/sdk", "@hyperlane-xyz/utils"],
  webpack: (config, { isServer, webpack }) => {
    config.resolve.fallback = {
      ...(config.resolve.fallback ?? {}),
      fs: false,
      net: false,
      tls: false,
      encoding: false,
    };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    );
    if (!isServer) {
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        "pino/file": false,
      };
    }
    return config;
  },
};

export default nextConfig;
