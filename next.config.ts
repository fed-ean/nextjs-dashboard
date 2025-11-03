// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
  
  // Puedes añadir otras configuraciones aquí si las tienes
  // ...
};

// Exportación correcta para TypeScript
export default nextConfig;

// ❌ ELIMINA POR COMPLETO ESTE BLOQUE OBSOLETO:
// module.exports = {
//   images: {
//     domains: ["https://radioempresaria.com.ar/", 'https://radioempresaria.com.ar/graphql'],
//   },
// };