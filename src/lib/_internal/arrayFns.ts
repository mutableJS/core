const arrayFns = [
	'concat',
	'join',
	'slice',
	'every',
	'some',
	'map',
	'filter',
	'reduce',
	'reduceRight',
] as const;

type ArrayFnNames = typeof arrayFns[number];

export function isArrayFn(input: any): input is ArrayFnNames {
	return arrayFns.includes(input);
}

// TBD: Fix return types
export type ArrayFns<Value> = Pick<Array<Value>, ArrayFnNames>;

export default arrayFns;
