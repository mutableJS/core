import { MaybeMutable } from './types';
import isMutable from './isMutable';
import { listen } from './eventBus';

export function processMaybeMutable<Data extends any>(
	actionFn: (data: Data) => void,
) {
	return (data: MaybeMutable<Data>) => {
		if (isMutable(data)) {
			listen(data, actionFn);

			actionFn(data.value);
		} else if (data) {
			actionFn(data);
		}
	};
}

export default processMaybeMutable;
