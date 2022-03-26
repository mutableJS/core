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

function mutable<Value extends any>(initialValue?: Value) {
	const events = new EventEmitter();

	const obj = new Proxy(
		{ value: initialValue },
		{
			get(target, prop) {
				switch (prop) {
					case '_mutable':
						return true;
					case 'onChange':
						return (callback: Mutable<Value>['onChange']) => {
							events.on(changeEvent, callback);
						};
					case 'valueOf':
						return () => target.value;
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

export function isMutable(item: any): item is Mutable<any> {
	return item._mutable;
}

export default mutable;
