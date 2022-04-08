export type Mutable<Value> = {
	readonly _mutable: true;
	readonly onChange: (
		callback: (newVal: Value, oldVal: Value) => void,
	) => void;
	value: Value;
};

export type MaybeMutable<Value> = Value | Mutable<Value>;
