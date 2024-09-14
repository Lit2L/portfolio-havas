/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true
	},
	images: {
		domains: ['api.microlink.io', 'pbs.twimg.com', 'images.unsplash.com']
	}
}

module.exports = nextConfig
