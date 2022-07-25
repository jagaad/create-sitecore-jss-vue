import config from './vite.config';
import { defineConfig, mergeConfig } from 'vite';

const serverConfig = defineConfig({
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

export default mergeConfig(config, serverConfig);
