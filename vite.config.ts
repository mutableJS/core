import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/lib/index.ts'),
			fileName: 'index',
			formats: ['umd', 'cjs', 'es'],
			name: 'mutation-test',
		},
		minify: false,
	},
});
