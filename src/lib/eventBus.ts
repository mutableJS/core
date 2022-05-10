// TBD: Events clean up needed?

type MutationEventCallback = (newVal: any, oldVal: any) => void;

function eventBus() {
	const refs: MutationEventCallback[] = [];

	const change: MutationEventCallback = (...data) => {
		refs.forEach((fn) => fn(...data));
	};

	const changeHandler = (callback: MutationEventCallback) => {
		refs.push(callback);
	};

	return {
		change,
		changeHandler,
	};
}

export default eventBus;
