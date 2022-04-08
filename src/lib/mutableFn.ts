import { MaybeMutable } from './types';
import mutable from './mutable';
import isMutable from './isMutable';

type MaybeMutableParams<Params> = {
	[K in keyof Params]: MaybeMutable<Params[K]>;
};

function convertParams<Params>(params: MaybeMutableParams<Params>) {
	const out = {} as Params;

	for (let key in params) {
		const item = params[key];

		out[key] = isMutable(item) ? item.value : item;
	}

	return out;
}

export function mutableFn<
	Params extends Record<string, unknown>,
	ReturnType extends any,
>(actionFn: (params: Params) => ReturnType) {
	return (params: MaybeMutableParams<Params>) => {
		let out = mutable(actionFn(convertParams(params)));

		for (let key in params) {
			const item = params[key];

			if (isMutable(item)) {
				item.onChange((newVal) => {
					const newParams = { ...params, [key]: newVal };

					out.value = actionFn(convertParams<Params>(newParams));
				});
			}
		}

		return out;
	};
}

export default mutableFn;
