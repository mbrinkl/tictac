import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
	plugins: [sveltekit(), tsconfigPaths()],
	css: {
		postcss: {
			plugins: [tailwindcss(), autoprefixer],
		},
	},
});
