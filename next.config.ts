// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Explicit turbopack config (even empty)
    // This silences the warning and prevents confusion
    turbopack: {},
    typescript: {
        ignoreBuildErrors: true, // 👈 THIS
    },

    webpack(config) {
        config.module.rules.push({
            test: /mathquill4keyboard\/build\/mathquill\.css$/,
            use: "null-loader",
        });
        return config;
    },
};

export default nextConfig;