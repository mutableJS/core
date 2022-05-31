import { Mutable } from './types';
import isRegularObject from './utils/isRegularObject';
import { emit } from './eventBus';

export function mutable<Value extends any>(initialValue?: Value) {
	const obj = new Proxy(
		{
			value:
				isRegularObject(initialValue) || Array.isArray(initialValue)
					? mutableObject(initialValue, handleChange)
					: initialValue,
		},
		{
			get(target, prop) {
				switch (prop) {
					case '_mutable':
						return true;
					default:
						return target.value;
				}
			},
			set(target, prop, value) {
				const oldVal = target.value;

				if (value !== oldVal) {
					target.value = value;

					handleChange(value, oldVal);
				}

				return true;
			},
		},
	) as Mutable<Value>;

	function handleChange(newVal: Value, oldVal: any) {
		emit(obj, newVal, oldVal);
	}

	return obj;
}

function mutableObject<Obj extends object | unknown[]>(
	initialValue: Obj,
	onChange: (newVal: Obj, oldVal: null) => void,
): Obj {
	const isArray = Array.isArray(initialValue);
	let actionCache: { type?: 'lenMod' | 'sort'; oldVal?: any } = {};

	const proxy = new Proxy(initialValue, {
		get(target, prop) {
			if (isArray) {
				switch (prop) {
					case 'sort':
						actionCache = { type: 'sort' };
						break;
					case 'push':
					case 'pop':
					case 'shift':
					case 'unshift':
					case 'splice':
						actionCache = { type: 'lenMod' };
						break;
				}
			}

			const item = target[prop as keyof Obj];

			return item;
		},
		set(target, prop, value) {
			target[prop as keyof Obj] = value;

			if (
				!actionCache.type ||
				(actionCache.type === 'lenMod' && prop === 'length') ||
				(actionCache.type === 'sort' &&
					prop === ((target as unknown[]).length - 1).toString())
			) {
				onChange(target, null);

				actionCache = {};
			}

			return true;
		},
		deleteProperty(target, prop) {
			delete target[prop as keyof Obj];
			onChange(target, null);

			return true;
		},
	});

	return proxy;
}

export default mutable;
