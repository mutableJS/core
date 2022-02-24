import mutable, { isMutable, maybeMutable } from './lib/mutable';
import mutableFn, { mixedParams } from './lib/mutableFn';

declare global {
	interface HTMLElement {
		setAttr: (name: string, value: maybeMutable<string>) => void;
		setAttributes: (attributes: mixedParams<HTMLElement>) => void;
	}
}

HTMLElement.prototype.setAttr = function (name, value) {
	if (isMutable(value)) {
		value.onChange((newVal) => {
			this.setAttribute(name, newVal);
		});

		this.setAttribute(name, value.value);
	} else {
		this.setAttribute(name, value);
	}
};

const root = document.getElementById('root');

const setInnerHTML = mutableFn<{
	target: HTMLElement;
	body: maybeMutable<any>;
}>(({ target, body }) => {
	target.innerHTML = body;
});

if (root) {
	const display = document.getElementById('display');
	const target = createComponent('span');
	display?.append(target);

	const i = mutable('0');

	target.innerHTML = i.value;

	// setInnerHTML({ target, body: i });

	const button = document.createElement('button');
	button.innerText = 'Click me';
	button.onclick = () => {
		i.value = (parseInt(i.value) + 1).toString();
	};

	root.prepend(button);
}

function createComponent<Tag extends keyof HTMLElementTagNameMap>(tag: Tag) {
	const element = document.createElement(tag);

	console.log('Object.entries(element)', Object.entries(Object.getPrototypeOf(element)));

	Object.entries(element).forEach(([key, property]) => {
		console.log('key', key);
		Object.defineProperty(element, key, {
			...property,
			set(value) {
				console.log('value', value);
				if (isMutable(value)) {
					value.onChange((newVal) => {
						this[key] = newVal;
					});

					this[key] = value.value;
				} else {
					this[key] = value;
				}
			},
		});
	});

	return element;
	// const proxy = new Proxy(
	// 	{ node: document.createElement(tag) },
	// 	{
	// 		get({ node }, prop) {
	// 			if (prop === 'valueOf') {
	// 				return () => node;
	// 			}

	// 			return node[prop as keyof HTMLElementTagNameMap[Tag]];
	// 		},
	// 		set({ node }, prop, value) {
	// if (isMutable(value)) {
	// 	value.onChange((newVal) => {
	// 		node[prop as keyof HTMLElementTagNameMap[Tag]] = newVal;
	// 	});

	// 	node[prop as keyof HTMLElementTagNameMap[Tag]] =
	// 		value.value;
	// } else {
	// 	node[prop as keyof HTMLElementTagNameMap[Tag]] = value;
	// }

	// 			return true;
	// 		},
	// 	},
	// );

	// console.log('proxy', proxy.prototype);

	// return proxy;
}
