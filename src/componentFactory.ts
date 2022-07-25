import type { DefineComponent } from 'vue';

type FakeModule = { default: DefineComponent };
const modules = import.meta.glob<FakeModule>('./components/**/*.vue', {
	eager: true,
});
const componentsEntries = Object.entries(modules).map(([path, component]) => {
	const componentName = path.split('/').at(-1).replace('.vue', '');
	return [componentName, component.default];
});

const components = Object.fromEntries(componentsEntries);

/*
  The component factory is a mapping between a string name and a Vue component instance.
  When the Sitecore Layout service returns a layout definition, it returns named components.
  This mapping is used to construct the Vue hierarchy for the layout.
*/
export default function componentFactory(componentName: string) {
	return components[componentName];
}
