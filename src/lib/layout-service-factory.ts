import {
	GraphQLLayoutService,
	RestLayoutService,
	constants,
} from '@sitecore-jss/sitecore-jss-vue';
import config from 'virtual:jss-config';

export class LayoutServiceFactory {
	create() {
		return import.meta.env.VITE_FETCH_WITH === constants.FETCH_WITH.GRAPHQL
			? new GraphQLLayoutService({
					endpoint: config.graphQLEndpoint,
					apiKey: config.sitecoreApiKey,
					siteName: config.jssAppName,
			  })
			: new RestLayoutService({
					apiHost: config.sitecoreApiHost,
					apiKey: config.sitecoreApiKey,
					siteName: config.jssAppName,
					configurationName: 'default',
			  });
	}
}

export const layoutServiceFactory = new LayoutServiceFactory();
