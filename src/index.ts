import mutable from './lib/mutable';
import mutableFn from './lib/mutableFn';
import mutableElement from './lib/mutableElement';

//	App root
const root = document.getElementById('root');

//	Mutable variables
const todos = mutable<string[]>([]);
const input = mutable<string>('');

//	Render function
const todoCount = mutableFn(({ todos }: { todos: string[] }) => [
	`Todos: ${todos.length}`,
]);
const children = mutableFn(({ todos: items }: { todos: string[] }) =>
	items.map((item, i) =>
		mutableElement('li', {
			innerText: item,
			style: 'cursor: no-drop; user-select: none;',
			onclick: () => {
				todos.value.splice(i, 1);
			},
		}),
	),
);

//	Add elements to app
root?.append(
	mutableElement('div', {
		children: todoCount({ todos }),
	}),
	mutableElement('input', {
		children: input,
		onchange: (event) => {
			if (event.target instanceof HTMLInputElement) {
				input.value = event.target.value;
			}
		},
	}),
	mutableElement('button', {
		innerText: 'Add todo',
		onclick() {
			todos.value.push(input.value);

			input.value = '';
		},
	}),
	mutableElement('ul', {
		children: children({ todos }),
	}),
);
