import { Mutable } from '../types';

type ObjectFnNames = keyof ObjectFns<any>;

const objectFns: ObjectFnNames[] = ['keys', 'values', 'entries'];

export function isObjectFn(input: any): input is ObjectFnNames {
	return objectFns.includes(input);
}

// TBD: Fix return types
export type ObjectFns<Values> = {
	keys(): Mutable<string[]>;
	values(): Mutable<Values[]>;
	entries(): Mutable<[string, Values][]>;
};
