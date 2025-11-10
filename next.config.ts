// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /mathquill4keyboard\/build\/mathquill.css$/,
            use: 'null-loader', // ignore this CSS file
        });
        return config;
    },
};

export default nextConfig;