import mutable, { isMutable, MaybeMutable, Mutable } from "./mutable";

export type MixedParams<Params> = {
	[K in keyof Params]: Params[K] extends Mutable<infer T>
		? MaybeMutable<T>
		: Params[K];
};

export type UnmutableParams<Params> = {
	[K in keyof Params]: Params[K] extends Mutable<infer T> ? T : Params[K];
};

function makeParams<Params>(params: MixedParams<Params>) {
	return Object.entries(params).reduce((acc, [key, item]) => {
		acc[key as keyof Params] = isMutable(item) ? item.value : item;

		return acc;
	}, {} as UnmutableParams<Params>);
}

function observeMutables<Params>(
	params: MixedParams<Params>,
	callback: (newParams: UnmutableParams<Params>) => void,
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
	call: (params: UnmutableParams<Params>) => any,
) {
	return (params: MixedParams<Params>) => {
		let out = mutable(call.call(null, makeParams(params)));

		observeMutables(params, (newParams) => {
			out.value = call(newParams);
		});

		return out;
	};
}

export default mutableFn;
