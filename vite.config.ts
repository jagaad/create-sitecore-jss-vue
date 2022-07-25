import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import graphql from '@rollup/plugin-graphql';
import { constants } from '@sitecore-jss/sitecore-jss-vue';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), graphql()],
	server: {
		open: true,
		host: true,
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
