import { isMutable, MaybeMutable } from './mutable';

type AllTags = keyof HTMLElementTagNameMap;

type MutableProps<Tag extends AllTags> = {
	[Key in keyof HTMLElementTagNameMap[Tag]]?: MaybeMutable<
		HTMLElementTagNameMap[Tag][Key]
	>;
};

function maybeMutableCallback<Data>(
	data: MaybeMutable<Data>,
	callback: (data: Data) => void,
) {
	if (isMutable(data)) {
		callback(data.value);

		data.onChange(callback);
	} else {
		callback(data);
	}
}

function mutableElement<Tag extends AllTags, Props extends MutableProps<Tag>>(
	tag: Tag,
	props?: Props,
) {
	type ElementKeys = keyof HTMLElementTagNameMap[Tag];

	const element = document.createElement(tag);

	if (props) {
		for (let [key, item] of Object.entries(props)) {
			switch (key) {
				case 'style':
					maybeMutableCallback(item, (data) => {
						element.setAttribute(key, data);
					});
					break;
				default:
					maybeMutableCallback(item, (data) => {
						element[key as ElementKeys] = data;
					});
					break;
			}
		}
	}

	return element;
}

export default mutableElement;
