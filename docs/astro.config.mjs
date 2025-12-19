// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Stlite',
			logo: {
				light: './src/assets/stlite.svg',
				dark: './src/assets/stlite-dark.svg',
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
		}),
	],
});
