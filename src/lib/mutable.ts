import { EventEmitter } from 'events';

const changeEvent = 'onChange';

export type Mutable<Value> = {
	readonly _mutable: true;
	readonly onChange: (
		callback: (newVal: Value, oldVal: Value) => void,
	) => void;
	value: Value;
};

export type MaybeMutable<Value> = Value | Mutable<Value>;

export function mutable<Value extends any>(initialValue?: Value) {
	const events = new EventEmitter();

	const obj = new Proxy(
		{
			value:
				initialValue && typeof initialValue === 'object'
					? mutableObject(
							initialValue as object | unknown[],
							(newVal, oldVal) =>
								events.emit(changeEvent, newVal, oldVal),
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
							events.on(changeEvent, callback);
						};
					default:
						return target.value;
				}
			},
			set(target, prop, value) {
				events.emit(changeEvent, value, target.value);

				target.value = value;

				return true;
			},
		},
	);

	return obj as Mutable<Value>;
}

export function isMutable(item: MaybeMutable<any>): item is Mutable<any> {
	return !!item?._mutable;
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
