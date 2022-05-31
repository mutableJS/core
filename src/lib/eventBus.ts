import { Mutable } from './types';

type Callback<T> = (newVal: T, oldVal: T) => void;

const eventBus = new WeakMap<object, Callback<any>[]>();

export function listen<T>(mutable: Mutable<T>, callback: Callback<T>) {
	const listeners = eventBus.get(mutable) || [];
	listeners.push(callback);

	eventBus.set(mutable, listeners);
}

export function emit<T>(mutable: Mutable<T>, newVal: T, oldVal?: T) {
	eventBus.get(mutable)?.forEach((fn) => {
		fn(newVal, oldVal);
	});
}
