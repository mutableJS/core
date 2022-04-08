import { MaybeMutable, Mutable } from "./types";

export function isMutable(item: MaybeMutable<any>): item is Mutable<any> {
	return !!item?._mutable;
}

export default isMutable;
