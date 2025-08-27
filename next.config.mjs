/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,

    images: {
        domains: ['images.unsplash.com'],
        // remotePatterns: ['images.unsplash.com']
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Prevent bundling native node modules into client
            config.externals.push({
                "@tensorflow/tfjs-node": "commonjs @tensorflow/tfjs-node",
                "node-pre-gyp": "commonjs node-pre-gyp",
                "@mapbox/node-pre-gyp": "commonjs @mapbox/node-pre-gyp",
            });
        }
        return config;
    },


};

export default nextConfig;



