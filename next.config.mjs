/** @type {import('next').NextConfig} */ 
const nextConfig = { 
  images: { 
    domains: ["img.clerk.com", "www.flaticon.com", "cdn-icons-png.flaticon.com","uxwing.com" ],
     // Clerk images зөвшөөрөгдөнө 
     remotePatterns: [ { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '**', }, 
      { protocol: 'https', hostname: 'raw.githubusercontent.com', pathname: '**', }, ], }, }; 
      
      export default nextConfig;