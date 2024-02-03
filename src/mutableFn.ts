import { MaybeMutable, Mutable } from './types';
import mutable from './mutable';
import isMutable from './isMutable';
import { listen } from './eventBus';

type MaybeMutableTuple<Input extends [...any[]]> = Input extends [
	infer First,
	...infer Rest,
]
	? [MaybeMutable<First>, ...MaybeMutableTuple<Rest>]
	: Input;

type MaybeMutableParams<Params extends any[]> = {
	[K in keyof Params]: Params[K] extends Mutable<any>
		? Params[K]
		: Params[K] extends Record<string, unknown>
		? MaybeMutable<{
				[OK in keyof Params[K]]: MaybeMutable<Params[K][OK]>;
		  }>
		: Params[K] extends [...any[]]
		? MaybeMutable<MaybeMutableTuple<Params[K]>>
		: MaybeMutable<Params[K]>;
};

export function mutableFn<Params extends any[], ReturnType>(
	actionFn: (...params: Params) => ReturnType,
) {
	type CallParams = MaybeMutableParams<Params>;

	return (...params: CallParams): Mutable<ReturnType> => {
		const pureParams = [] as unknown as Params;
		params.forEach((arg, i) => {
			if (isMutable(arg)) {
				listen(arg, (newVal) => {
					pureParams[i] = newVal;

					rerun();
				});

				pureParams[i] = arg.value;
			} else if (typeof arg === 'object') {
				pureParams[i] = Array.isArray(arg) ? [] : {};

				Object.entries(arg).forEach(([key, item]) => {
					if (isMutable(item)) {
						listen(item, (newVal) => {
							pureParams[i][key] = newVal;

							rerun();
						});

						pureParams[i][key] = item.value;
					} else {
						pureParams[i][key] = item;
					}
				});
			} else {
				pureParams[i] = arg;
			}
		});

		let out = mutable(actionFn.apply(null, pureParams));

		function rerun() {
			out.value = actionFn.apply(null, pureParams);
		}

		return out;
	};
}

export default mutableFn;
