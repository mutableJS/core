import { MutationCallback } from './eventBus';

export type Mutable<Value> = {
	readonly _mutable: true;
	readonly onChange: (callback: MutationCallback<Value>) => void;
	value: Value;
} & (Value extends (infer A)[] ? ArrayActions<A> : Record<string, never>);

export type MaybeMutable<Value> = Value | Mutable<Value>;

type ArrayActions<Value> = Pick<
	Array<Value>,
	'every' | 'forEach' | 'map' | 'some'
>;
