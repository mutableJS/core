import { MaybeMutable } from './types';
import isMutable from './isMutable';

export function processMaybeMutable<Data extends any>(
	actionFn: (data: Data) => void,
) {
	return (data: MaybeMutable<Data>) => {
		if (isMutable(data)) {
			data.onChange(actionFn);

			actionFn(data.value);
		} else if (data) {
			actionFn(data);
		}
	};
}

export default processMaybeMutable;
