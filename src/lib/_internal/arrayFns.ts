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

// TBD: Fix return types
export type ArrayFns<Value> = Pick<Array<Value>, typeof arrayFns[number]>;

export default arrayFns;
