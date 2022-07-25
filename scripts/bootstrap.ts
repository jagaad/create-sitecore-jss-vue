import { constants } from '@sitecore-jss/sitecore-jss-vue';
import configGenerator from './generate-config';
import chalk from 'chalk';

/*
  BOOTSTRAPPING
  The bootstrap process runs before build, and generates JS that needs to be
  included into the build - specifically, the component name to component mapping,
  and the global config module.
*/

const disconnected =
	import.meta.env.VITE_JSS_MODE === constants.JSS_MODE.DISCONNECTED;

if (
	disconnected &&
	import.meta.env.VITE_FETCH_WITH === constants.FETCH_WITH.GRAPHQL
) {
	throw new Error(
		chalk.red(
			'GraphQL requests to Dictionary and Layout services are not supported in disconnected mode.',
		),
	);
}

/*
  CONFIG GENERATION
  Generates the /src/temp/config.js file which contains runtime configuration
  that the app can import and use.
*/
const configOverride = disconnected
	? {
			sitecoreApiHost: `http://localhost:${
				import.meta.env.VITE_PROXY_PORT || 5173
			}`,
	  }
	: null;

configGenerator(configOverride);
