/*
  When the app runs in disconnected mode, and Sitecore is not present, we need to give
  the app copies of the Sitecore APIs it depends on (layout service, dictionary service, content service)
  to talk to so that the app can run using the locally defined disconnected data.

  This is accomplished by spinning up a small Express server that mocks the APIs, and then
  telling the dev server to proxy requests to the API paths to this express instance.
*/

import path from 'path';
import {
	createDefaultDisconnectedServer,
	DisconnectedServerOptions,
} from '@sitecore-jss/sitecore-jss-dev-tools';
import config from 'virtual:jss-config';

const proxyOptions: DisconnectedServerOptions = {
	appRoot: path.join(__dirname, '..'),
	appName: config.jssAppName,
	watchPaths: ['./data'],
	language: config.defaultLanguage,
	port: Number(import.meta.env.VITE_PROXY_PORT) || 3042,
	requireArg: 'esbuild-register',
	// TODO: Find a way to reload application when manifest was updated
	// https://github.com/ElMassimo/vite-plugin-full-reload
	// onManifestUpdated() {},
};

// Need to customize something that the proxy options don't support?
// createDefaultDisconnectedServer() is a boilerplate that you can copy from
// and customize the middleware registrations within as you see fit.
// See https://github.com/Sitecore/jss/blob/master/packages/sitecore-jss-dev-tools/src/disconnected-server/create-default-disconnected-server.ts
createDefaultDisconnectedServer(proxyOptions);
