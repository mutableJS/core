import mutable from './lib/mutable';
import mutableFn from './lib/mutableFn';
import mutableElement from './lib/mutableElement';

//	App root
const root = document.getElementById('root');

//	Mutable variables
const todos = mutable<string[]>([]);
const input = mutable<string>('');

//	Render function
const children = mutableFn(({ todos: items }: { todos: string[] }) =>
	items.map((item, i) =>
		mutableElement('li', {
			innerText: item,
			style: 'cursor: no-drop;',
			onclick: () => {
				todos.value.splice(i, 1);
				todos.value = todos.value;
			},
		}),
	),
);

//	Add elements to app
root?.appendChild(
	mutableElement('input', {
		children: input,
		onchange: (event) => {
			if (event.target instanceof HTMLInputElement) {
				input.value = event.target.value;
			}
		},
	}),
);

root?.appendChild(
	mutableElement('button', {
		innerText: 'Add todo',
		onclick() {
			todos.value.push(input.value);
			todos.value = todos.value;

			input.value = '';
		},
	}),
);

root?.appendChild(
	mutableElement('ul', {
		children: children({ todos }),
	}),
);
