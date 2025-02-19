/** @type {import('next').NextConfig} */
import nextPwa from "next-pwa";

export const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};


const withPWA = nextPwa({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const config = {
  reactStrictMode: true,
};

export default withPWA(config);