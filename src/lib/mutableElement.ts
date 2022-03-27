import { isMutable, MaybeMutable } from './mutable';

type AllTags = keyof HTMLElementTagNameMap;

type MutableObject<Object> = {
	[Key in keyof Object]?: MaybeMutable<Object[Key]>;
};

type MutableProps<Tag extends AllTags> = MutableObject<{
	innerHTML: HTMLElementTagNameMap[Tag]['innerHTML'];
	innerText: string;
	style: string | MutableObject<CSSStyleDeclaration>;
	onclick: () => void;
}>;

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
		props.innerHTML &&
			maybeMutableCallback(props.innerHTML, (data) => {
				element.innerHTML = data;
			});

		props.innerText &&
			maybeMutableCallback(props.innerText, (data) => {
				element.innerText = data;
			});

		props.style &&
			maybeMutableCallback(props.style, (data) => {
				if (typeof data === 'string') {
					element.setAttribute('style', data);
				} else {
					// element.setAttribute('style', data);
				}
			});

		props.onclick &&
			maybeMutableCallback(props.onclick, (data) => {
				element.onclick = data;
			});
	}

	return element;
}

export default mutableElement;
