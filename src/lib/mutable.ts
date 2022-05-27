import { Mutable } from './types';
import isMutableObjectValue from './utils/isMutableObjectValue';
import eventBus from './eventBus';
import mutableFn from './mutableFn';

export function mutable<Value extends any>(initialValue?: Value) {
	const events = eventBus();

	const isMutableObject = isMutableObjectValue(initialValue);
	const valueType = isMutableObjectValue(initialValue)
		? Array.isArray(initialValue)
			? 'array'
			: 'object'
		: 'primitive';

	const obj = new Proxy(
		{
			value: isMutableObject
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
						if (valueType === 'array') {
							switch (prop) {
								case 'every':
								case 'forEach':
								case 'map':
								case 'some':
									return (callback: any) =>
										mutableFn((data) =>
											data[prop](callback),
										)(obj);
							}
						}

						return target.value;
				}
			},
			set(...[target, , value]) {
				const prevValue = target.value;

				if (value !== prevValue) {
					target.value = value;
					events.change(value, prevValue);
				}

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
