import mutableElement from './lib/mutableElement';
import mutable, { MaybeMutable } from './lib/mutable';
import mutableFn from './lib/mutableFn';

const setInnerHTML = mutableFn<{
	target: HTMLElement;
	body: MaybeMutable<any>;
}>(({ target, body }) => {
	target.innerHTML = body;
});

const root = document.getElementById('root');
if (root) {
	const display = document.getElementById('display');
	const innerHTML = mutable('0');
	const target = mutableElement('span', { innerHTML });

	display?.append(target);

	// target.mInnerText = i;
	// setInnerHTML({ target, body: i });

	const button = document.createElement('button');
	button.innerText = 'Click me';
	button.onclick = () => {
		innerHTML.value = (parseInt(innerHTML.value) + 1).toString();
	};

	root.prepend(button);
}
