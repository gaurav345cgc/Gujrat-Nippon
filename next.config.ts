import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/products/turnkey",
        destination: "/products/turnkey-plant-engineering",
        permanent: true,
      },
      {
        source: "/products/spares",
        destination: "/products/industrial-spares-consumables",
        permanent: true,
      },
      {
        source: "/products/chemicals",
        destination: "/products/industrial-chemicals-lubricants",
        permanent: true,
      },
      {
        source: "/products/moulding",
        destination: "/products/plastic-moulding-systems",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
