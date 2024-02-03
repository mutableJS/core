import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
	entries: ['src/index'],
	externals: ['vite', '@mutablejs/core'],
	clean: true,
	declaration: true,
	rollup: {
		output: { exports: 'named' },
		emitCJS: true,
		inlineDependencies: true,
	},
});
