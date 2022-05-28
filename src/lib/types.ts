import { MutationCallback } from './eventBus';
import { ArrayFns } from './_internal/arrayFns';

export type Mutable<Value> = {
	readonly _mutable: true;
	readonly onChange: (callback: MutationCallback<Value>) => void;
	value: Value;
} & (Value extends (infer A)[] ? ArrayFns<A> : Record<string, never>);

export type MaybeMutable<Value> = Value | Mutable<Value>;
