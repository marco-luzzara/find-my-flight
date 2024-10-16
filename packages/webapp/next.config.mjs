/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        fetches: {
            fullUrl: true
        }
    },
    env: {
        API_ENDPOINT: process.env.API_ENDPOINT
    }
};

export default nextConfig;
