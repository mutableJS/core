import { Mutable } from '../types';

type ObjectFnNames = keyof ObjectFns<any>;

const objectFns: Set<ObjectFnNames> = new Set(['keys', 'values', 'entries']);

export function isObjectFn(input: any): input is ObjectFnNames {
	return objectFns.has(input);
}

export type ObjectFns<Values> = {
	keys(): Mutable<string[]>;
	values(): Mutable<Values[]>;
	entries(): Mutable<[string, Values][]>;
};
