/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8282',
				pathname: '/media/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8282',
				pathname: '/products/**',
			},
			{
				protocol: 'https',
				hostname: 'api.keethjewels.com',
				port: '',
				pathname: '/media/**',
			},
		],
	},
};

export default nextConfig;
