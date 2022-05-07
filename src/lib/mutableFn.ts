import { MaybeMutable, Mutable } from './types';
import mutable from './mutable';
import isMutable from './isMutable';
import isRegularObject from './utils/isRegularObject';

type MaybeMutableParams<Params extends any[]> = {
	[K in keyof Params]: Params[K] extends Mutable<any>
		? Params[K]
		: Params[K] extends Record<string, unknown>
		? MaybeMutable<{
				[OK in keyof Params[K]]: MaybeMutable<Params[K][OK]>;
		  }>
		: Params[K] extends Array<infer T>
		? MaybeMutable<T>[]
		: MaybeMutable<Params[K]>;
};

function convertParams<Params extends any[]>(
	params: MaybeMutableParams<Params>,
) {
	const converted = [] as any[];

	params.forEach((item, i) => {
		if (isMutable(item)) {
			converted[i] = item.value;
		} else if (isRegularObject(item)) {
			const objectParam = Object.entries(item).reduce(
				(acc, [key, value]) => {
					acc[key] = isMutable(value) ? value.value : value;

					return acc;
				},
				{} as Record<string, unknown>,
			);

			converted[i] = objectParam;
		} else {
			converted[i] = item;
		}
	});

	return converted as Params;
}

export function mutableFn<Params extends any[], ReturnType>(
	actionFn: (...params: Params) => ReturnType,
) {
	type CallParams = MaybeMutableParams<Params>;

	return (...params: CallParams): Mutable<ReturnType> => {
		let out = mutable(actionFn.apply(null, convertParams(params)));

		function update(newParams: CallParams) {
			out.value = actionFn.apply(null, convertParams(newParams));
		}

		params.forEach((arg, i) => {
			if (isMutable(arg)) {
				arg.onChange((newVal) => {
					const newParams = [...params];
					newParams[i] = newVal;

					update(newParams as CallParams);
				});
			} else if (typeof arg === 'object') {
				Object.entries(arg).forEach(([key, item]) => {
					if (isMutable(item)) {
						item.onChange((newVal) => {
							const newParams = [...params];
							newParams[i] = { ...arg, [key]: newVal };

							update(newParams as CallParams);
						});
					}
				});
			}
		});

		return out;
	};
}

export default mutableFn;
