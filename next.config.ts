// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,            // si necesita exportación estática
  experimental: {
    globalNotFound: true       // habilita 404 global
  },
  // Configuración de Imágenes (MÉTODO MODERNO)
  images: {
    // remotePatterns es la forma correcta de configurar dominios en Next.js 13+
    remotePatterns: [
      {
        protocol: 'https',
        // ¡IMPORTANTE! El hostname NO debe incluir 'http://' o 'https://'
        hostname: 'radioempresaria.com.ar', 
        port: '',
        // Esto cubre todas las imágenes de WordPress
        pathname: '/wp-content/uploads/**', 
      },
    ],
    // NOTA: Si necesitas el host para imágenes que NO son de uploads (raro), 
    // podrías añadir otra entrada aquí.
  },
  
  // Reescribir las rutas para actuar como un proxy y evitar problemas de CORS
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: 'https://radioempresaria.com.ar/graphql',
      },
    ]
  },

  // Puedes añadir otras configuraciones aquí si las tienes
  // ...
  devIndicators: {
    allowedDevOrigins: [
      "https://3001-firebase-nextjs-dashboard-1762132150734.cluster-57i2ylwve5fskth4xb2kui2ow2.cloudworkstations.dev",
    ],
  },
};

// Exportación correcta para TypeScript
export default nextConfig;

// ❌ ELIMINA POR COMPLETO ESTE BLOQUE OBSOLETO:
// module.exports = {
//   images: {
//     domains: ["https://radioempresaria.com.ar/", 'https://radioempresaria.com.ar/graphql'],
//   },
// };
