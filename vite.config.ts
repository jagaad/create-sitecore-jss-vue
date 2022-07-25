import 'dotenv/config';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import graphql from '@rollup/plugin-graphql';
import { constants } from '@sitecore-jss/sitecore-jss-vue';
import chalk from 'chalk';
import vitePluginJssConfig from './plugins/vite-plugin-jss-config';

const disconnected =
	process.env.VITE_JSS_MODE === constants.JSS_MODE.DISCONNECTED;

if (
	disconnected &&
	process.env.VITE_FETCH_WITH === constants.FETCH_WITH.GRAPHQL
) {
	const message = `GraphQL requests to Dictionary and Layout services are not supported in disconnected mode.`;
	throw new Error(chalk.red(message));
}

const configOverrides = {
	sitecoreApiHost: disconnected
		? `http://localhost:${process.env.VITE_PROXY_PORT || 5173}`
		: undefined,
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), graphql(), vitePluginJssConfig(configOverrides)],
	define: {
		__VUE_I18N_FULL_INSTALL__: true,
		__VUE_I18N_LEGACY_API__: true,
		__INTLIFY_PROD_DEVTOOLS__: false,
	},
	server: {
		open: true,
		host: true,
		// TODO: Get rid of proxy, and create middlewares directly in Vite
		proxy: {
			'/sitecore':
				process.env.VITE_JSS_MODE === constants.JSS_MODE.DISCONNECTED
					? `http://localhost:${process.env.PROXY_PORT || 3042}`
					: undefined,
		},
	},
	resolve: {
		alias: {
			// @sitecore-jss/sitecore-jss-dev-tools does not output valid esm
			'@sitecore-jss/sitecore-jss-dev-tools':
				'@sitecore-jss/sitecore-jss-dev-tools/dist/cjs/index.js',
		},
	},
});
