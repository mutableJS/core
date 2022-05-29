import { MutationCallback } from './eventBus';
import { ArrayFns } from './_internal/arrayFns';
import { ObjectFns } from './_internal/objectFns';

export type Mutable<Value> = {
	readonly _mutable: true;
	readonly onChange: (callback: MutationCallback<Value>) => void;
	value: Value;
} & (Value extends (infer T)[]
	? ArrayFns<T>
	: Value extends Record<string, infer T>
	? ObjectFns<T>
	: Record<string, never>);

export type MaybeMutable<Value> = Value | Mutable<Value>;
