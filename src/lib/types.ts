export type Mutable<Value> = {
	readonly _mutable: true;
	value: Value;
};

export type MaybeMutable<Value> = Value | Mutable<Value>;
