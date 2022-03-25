import { isMutable, maybeMutable } from './mutable';

[HTMLElement].forEach(
	(element) =>
		Object.keys(element.prototype).forEach((key) => {
			const newKey = `m${key[0].toUpperCase()}${key.substring(1)}`;

			Object.defineProperty(HTMLElement.prototype, newKey, {
				configurable: false,
				get() {
					return this[key];
				},
				set(value: maybeMutable<string>) {
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
		}),
);

function mutableElement<Tag extends keyof HTMLElementTagNameMap>(tag: Tag) {
	const element = document.createElement(tag);

	return element as HTMLElementTagNameMap[Tag] & {
		[Key in string &
			keyof HTMLElementTagNameMap[Tag] as `m${Capitalize<Key>}`]: maybeMutable<
			HTMLElementTagNameMap[Tag][Key]
		>;
	};
}

export default mutableElement;
