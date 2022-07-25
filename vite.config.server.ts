import config from './vite.config';
import { mergeConfig } from 'vite';

export default mergeConfig(config, {
	ssr: {
		noExternal: /./,
	},
	resolve: {
		// necessary because vue.ssrUtils is only exported on cjs modules
		alias: [
			{
				find: '@vue/runtime-dom',
				replacement: '@vue/runtime-dom/dist/runtime-dom.cjs.js',
			},
			{
				find: '@vue/runtime-core',
				replacement: '@vue/runtime-core/dist/runtime-core.cjs.js',
			},
		],
	},
});
