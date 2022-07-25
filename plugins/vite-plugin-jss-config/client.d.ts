declare module 'virtual:jss-config' {
	const config: {
		defaultLanguage: string;
		graphQLEndpoint: string;
		graphQLEndpointPath: string;
		jssAppName: string;
		sitecoreApiHost: string;
		sitecoreApiKey: string;
	};

	export default config;
}
