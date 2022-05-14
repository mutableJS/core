// TBD: Events clean up needed?

export type MutationCallback<Value = any> = (newVal: Value, oldVal: Value) => void;

function eventBus() {
	const refs: MutationCallback[] = [];

	const change: MutationCallback = (...data) => {
		refs.forEach((fn) => fn(...data));
	};

	const changeHandler = (callback: MutationCallback) => {
		refs.push(callback);
	};

	return {
		change,
		changeHandler,
	};
}

export default eventBus;
