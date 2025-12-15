// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Stlite',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/whitphx/stlite' }],
			sidebar: [
				{ label: 'Introduction', link: '/' },
				{ label: '@stlite/browser', slug: 'browser' },
				{ label: '@stlite/react', slug: 'react' },
				{ label: '@stlite/desktop', slug: 'desktop' },
			],
		}),
	],
});
