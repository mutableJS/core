import mutableElement from './lib/mutableElement';
import mutable, { maybeMutable } from './lib/mutable';
import mutableFn from './lib/mutableFn';

const setInnerHTML = mutableFn<{
	target: HTMLElement;
	body: maybeMutable<any>;
}>(({ target, body }) => {
	target.innerHTML = body;
});

const root = document.getElementById('root');
if (root) {
	const display = document.getElementById('display');
	const target = mutableElement('span');

	display?.append(target);

	const i = mutable('0');

	// target.mInnerText = i;
	setInnerHTML({ target, body: i });

	const button = document.createElement('button');
	button.innerText = 'Click me';
	button.onclick = () => {
		i.value = (parseInt(i.value) + 1).toString();
	};

	root.prepend(button);
}
