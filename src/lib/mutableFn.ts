import mutable, { isMutable, MaybeMutable, Mutable } from './mutable';

export type UnmutableParams<Params> = {
	[K in keyof Params]: Params[K] extends Mutable<infer T> ? T : Params[K];
};

type MaybeMutableParams<Params> = {
	[K in keyof Params]: MaybeMutable<Params[K]>;
};

function convertParams<Params>(params: MaybeMutableParams<Params>) {
	const out = {} as UnmutableParams<Params>;

	for (let key in params) {
		const item = params[key];

		out[key] = isMutable(item) ? item.value : item;
	}

	return out;
}

function mutableFn<Params extends Record<string, unknown>>(
	func: (params: UnmutableParams<Params>) => any,
) {
	return (params: MaybeMutableParams<Params>) => {
		let out = mutable(func.call(null, convertParams(params)));

		for (let key in params) {
			const item = params[key];

			if (isMutable(item)) {
				item.onChange((newVal) => {
					const newParams = { ...params, [key]: newVal };

					out.value = func.call(
						null,
						convertParams<Params>(newParams),
					);
				});
			}
		}

		return out;
	};
}

export default mutableFn;
