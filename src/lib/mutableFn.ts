import mutable, { isMutable, maybeMutable, Mutable } from "./mutable";

export type mixedParams<Params> = {
	[K in keyof Params]: Params[K] extends Mutable<infer T>
		? maybeMutable<T>
		: Params[K];
};

export type unmutableParams<Params> = {
	[K in keyof Params]: Params[K] extends Mutable<infer T> ? T : Params[K];
};

function makeParams<Params>(params: mixedParams<Params>) {
	return Object.entries(params).reduce((acc, [key, item]) => {
		acc[key as keyof Params] = isMutable(item) ? item.value : item;

		return acc;
	}, {} as unmutableParams<Params>);
}

function observeMutables<Params>(
	params: mixedParams<Params>,
	callback: (newParams: unmutableParams<Params>) => void,
) {
	Object.entries(params).forEach(([key, item], i) => {
		if (isMutable(item)) {
			item.onChange((newVal) => {
				const newParams = { ...params, [key]: newVal };

				callback(makeParams<Params>(newParams));
			});
		}
	});
}

function mutableFn<Params extends Record<string, unknown>>(
	call: (params: unmutableParams<Params>) => any,
) {
	return (params: mixedParams<Params>) => {
		let out = mutable(call.call(null, makeParams(params)));

		observeMutables(params, (newParams) => {
			out.value = call(newParams);
		});

		return out;
	};
}

export default mutableFn;
