import { Mutable } from './types';
import isRegularObject from './utils/isRegularObject';
import eventBus from './eventBus';

export function mutable<Value extends any>(initialValue?: Value) {
	const events = eventBus();

	const obj = new Proxy(
		{
			value:
				isRegularObject(initialValue) || Array.isArray(initialValue)
					? mutableObject(initialValue, (newVal, oldVal) =>
							events.change(newVal, oldVal),
					  )
					: initialValue,
		},
		{
			get(target, prop) {
				switch (prop) {
					case '_mutable':
						return true;
					case 'onChange':
						return (callback: Mutable<Value>['onChange']) => {
							events.changeHandler(callback);
						};
					default:
						return target.value;
				}
			},
			set(...[target, , value]) {
				events.change(value, target.value);

				target.value = value;

				return true;
			},
		},
	);

	return obj as Mutable<Value>;
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
