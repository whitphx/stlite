// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Stlite',
			logo: {
				src: './src/assets/logo-themed.svg',
				replacesTitle: true,
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/whitphx/stlite' }],
			customCss: [
				// Relative path to your custom CSS file
				'./src/styles/custom.css',
			],
			sidebar: [
				{ label: 'Introduction', link: '/' },
				{ label: '@stlite/browser', slug: 'browser' },
				{ label: '@stlite/react', slug: 'react' },
				{ label: '@stlite/desktop', slug: 'desktop' },
			],
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon.svg',
						sizes: 'any',
						type: 'image/svg+xml',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon-48x48.png',
						sizes: '48x48',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'apple-touch-icon',
						href: '/apple-touch-icon.png',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'manifest',
						href: '/site.webmanifest',
					},
				},
			],
		}),
	],
	vite: {
		server: {
			fs: {
				deny: ['.env', '.env.*', '*.{crt,pem}'],
			}
		}
	}
});
