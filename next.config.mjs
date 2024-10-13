/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    // to run it locally, you need:
    // OPENAI_API_KEY: <your openai api key>
    // optional (not used yet)
    // (user auth)
    // GOOGLE_CLIENT_ID: ...
    // GOOGLE_CLIENT_SECRET: ...
    // AUTH_SECRET: ...
    // (monogodb)
    // DATABASE_URL: ...
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

export default nextConfig;
