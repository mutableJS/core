import { Mutable } from './types';

export function isMutable(item: any): item is Mutable<any> {
	return item?._mutable === true;
}

export default isMutable;
