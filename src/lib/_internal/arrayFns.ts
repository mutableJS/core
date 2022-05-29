import { Mutable } from '../types';

type ArrayFnNames = keyof ArrayFns<any>;

const arrayFns: Set<ArrayFnNames> = new Set(['every', 'some', 'sort', 'map', 'filter', 'reduce', 'reduceRight']);

export function isArrayFn(input: any): input is ArrayFnNames {
	return arrayFns.has(input);
}

export type ArrayFns<Values> = {
	every(
		...params: Parameters<Array<Values>['every']>
	): Mutable<ReturnType<Array<Values>['every']>>;
	some(
		...params: Parameters<Array<Values>['some']>
	): Mutable<ReturnType<Array<Values>['some']>>;
	sort(
		...params: Parameters<Array<Values>['sort']>
	): Mutable<ReturnType<Array<Values>['sort']>>;
	map(
		...params: Parameters<Array<Values>['map']>
	): Mutable<ReturnType<Array<Values>['map']>>;
	filter(
		...params: Parameters<Array<Values>['filter']>
	): Mutable<ReturnType<Array<Values>['filter']>>;
	reduce(
		...params: Parameters<Array<Values>['reduce']>
	): Mutable<ReturnType<Array<Values>['reduce']>>;
	reduceRight(
		...params: Parameters<Array<Values>['reduceRight']>
	): Mutable<ReturnType<Array<Values>['reduceRight']>>;
};
