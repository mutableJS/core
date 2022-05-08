import { MaybeMutable, Mutable } from './types';
import mutable from './mutable';
import isMutable from './isMutable';

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

function purifyParams<Params extends any[]>(
	params: MaybeMutableParams<Params>,
) {
	const pure = [] as any[];

	params.forEach((arg, i) => {
		if (isMutable(arg)) {
			pure[i] = arg.value;
		} else if (typeof arg === 'object') {
			pure[i] = Array.isArray(arg) ? [] : {};

			Object.entries(arg).forEach(([key, item]) => {
				pure[i][key] = isMutable(item) ? item.value : item;
			});
		} else {
			pure[i] = arg;
		}
	});

	return pure as Params;
}

export function mutableFn<Params extends any[], ReturnType>(
	actionFn: (...params: Params) => ReturnType,
) {
	type CallParams = MaybeMutableParams<Params>;

	return (...params: CallParams): Mutable<ReturnType> => {
		let out = mutable(actionFn.apply(null, purifyParams(params)));

		function update(newParams: CallParams) {
			out.value = actionFn.apply(null, purifyParams(newParams));
		}

		params.forEach((arg, i) => {
			if (isMutable(arg)) {
				arg.onChange((newVal) => {
					const newParams = [...params];
					newParams[i] = newVal;

					update(newParams as CallParams);
				});
			} else if (typeof arg === 'object') {
				const isArray = Array.isArray(arg);

				Object.entries(arg).forEach(([key, item]) => {
					if (isMutable(item)) {
						item.onChange((newVal) => {
							const newParams = [...params];
							newParams[i] = isArray ? [...arg] : { ...arg };
							newParams[i][key] = newVal;

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
