import mutableElement from './lib/mutableElement';
import mutable from './lib/mutable';
import mutableFn from './lib/mutableFn';

const countToString = mutableFn(({ i }) => `${i}`);
const style = mutableFn<{ i: number }>(({ i }) => `min-width: ${i * 10}px;`);

const root = document.getElementById('root');
if (root) {
	const display = document.getElementById('display');

	const count = mutable(0);

	const target = mutableElement('span', {
		innerHTML: countToString({ i: count }),
	});

	display?.append(target);

	const button = mutableElement('button', {
		innerText: 'Click me',
		style: style({ i: count }),
		onclick() {
			count.value += 1;
		},
	});
	// button.onclick = () => {
	// 	count.value += 1;
	// };

	root.prepend(button);
}
