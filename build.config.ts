import {defineBuildConfig} from 'unbuild'

export default defineBuildConfig({
	declaration: true,
	entries: [
		'src/module',
		{
			input: 'src/cli',
			builder: 'mkdist',
			outDir: 'dist/cli',
		}
	],
	externals: [
		// TODO:: doublecheck with code
		'mongoose',
		'jose',
		'crypto',
		'pathe',
	]
});
