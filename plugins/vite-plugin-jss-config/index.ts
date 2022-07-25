import { constantCase } from 'constant-case';
import { Plugin } from 'vite';
import packageConfig from '../../package.json' assert { type: 'json ' };

const plugin = (configOverrides?): Plugin => {
	const virtualModuleId = 'virtual:jss-config';
	const resolvedVirtualModuleId = '\0' + virtualModuleId;

	const defaultConfig = {
		sitecoreApiKey: 'no-api-key-set',
		sitecoreApiHost: '',
		jssAppName: 'Unknown',
	};

	// require + combine config sources
	const scjssConfig = transformScJssConfig();
	const packageJson = transformPackageConfig();

	const config = Object.assign(
		defaultConfig,
		scjssConfig,
		packageJson,
		configOverrides,
	);

	return {
		name: 'vite-plugin-jss-config', // required, will show up in warnings and errors
		resolveId(id: string) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
		},
		load(id: string) {
			if (id !== resolvedVirtualModuleId) return;

			let configText = `const config = {};\n`;

			// Set base configuration values, allowing override with environment variables
			Object.keys(config).forEach((prop) => {
				configText += `config.${prop} = import.meta.env.VITE_${constantCase(
					prop,
				)} || "${config[prop]}",\n`;
			});

			// The GraphQL endpoint is an example of making a _computed_ config setting
			// based on other config settings.
			const computedConfig: any = {};
			computedConfig.graphQLEndpoint =
				'`${config.sitecoreApiHost}${config.graphQLEndpointPath}`';

			// Set computed values, allowing override with environment variables
			Object.keys(computedConfig).forEach((prop) => {
				configText += `config.${prop} = import.meta.env.VITE_${constantCase(
					prop,
				)} || ${computedConfig[prop]};\n`;
			});

			configText += 'export default config;';

			return configText;
		},
	};
};

export default plugin;

function transformScJssConfig() {
	// scjssconfig.json may not exist if you've never run setup
	// so if it doesn't we substitute a fake object
	let config;
	try {
		config = require('../../scjssconfig.json');
	} catch (e) {
		return {};
	}

	if (!config) return {};

	return {
		sitecoreApiKey: config.sitecore.apiKey,
		sitecoreApiHost: config.sitecore.layoutServiceHost,
	};
}

function transformPackageConfig() {
	if (!packageConfig.config) return {};

	return {
		jssAppName: packageConfig.config.appName,
		defaultLanguage: packageConfig.config.language || 'en',
		graphQLEndpointPath: packageConfig.config.graphQLEndpointPath || null,
	};
}
