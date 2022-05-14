import { MutationCallback } from './eventBus';

export type Mutable<Value> = {
	readonly _mutable: true;
	readonly onChange: (callback: MutationCallback<Value>) => void;
	value: Value;
};

export type MaybeMutable<Value> = Value | Mutable<Value>;
