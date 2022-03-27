import { isMutable, MaybeMutable } from './mutable';

type AllTags = keyof HTMLElementTagNameMap;

type MutableObject<Object> = {
	[Key in keyof Object]?: MaybeMutable<Object[Key]>;
};

type MutableProps<Tag extends AllTags> = MutableObject<{
	innerHTML: HTMLElementTagNameMap[Tag]['innerHTML'];
	children: HTMLElementTagNameMap[Tag] extends HTMLInputElement
		? string
		: Parameters<HTMLElementTagNameMap[Tag]['replaceChildren']>;
	innerText: string;
	style: string | MutableObject<CSSStyleDeclaration>;
	onclick: HTMLElement['onclick'];
	onchange: HTMLInputElement['onkeyup'];
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

		props.children &&
			maybeMutableCallback(props.children, (data) => {
				if (element instanceof HTMLInputElement) {
					element.value = data.toString();
				} else {
					element.replaceChildren(...data);
				}
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

		props.onchange &&
			maybeMutableCallback(props.onchange, (data) => {
				element.onkeyup = data;
			});
	}

	return element;
}

export default mutableElement;
