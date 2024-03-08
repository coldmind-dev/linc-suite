import ts from 'rollup-plugin-ts';
//import dts from 'rollup-plugin-dts';

export default [
	{
		input: './src/linc.client-build.ts',
		output: {file: './dist/index.js', format: 'cjs'},
		plugins: [ts()]
	},
	/*/ Second config for .d.ts
	{
		input: './dist/',
		output: [{file: './dist/typings.d.ts', format: 'es'}],
		plugins: [dts()]
	}
	*/
];
