import mutable from './lib/mutable';
import mutableFn from './lib/mutableFn';

const body = document.body;

const log = {
	label(label: string) {
		console.log('\t', label);

		const div = document.createElement('div');
		div.innerHTML = '&nbsp;'.repeat(4) + label;
		body.appendChild(div);
	},
	change: mutableFn(({ input }) => {
		console.log(input);
		console.log('=================');

		const div = document.createElement('div');
		div.innerHTML =
			JSON.stringify(input, null, 4).replace(/ /g, '&nbsp;') +
			'<br />=================';
		body.appendChild(div);
	}),
};

log.label('<------- Array ------->');
const arr = mutable([1, 2, 3]);

log.label('\tinitial value');

log.change({ input: arr }); // <- being rerun on mutation

log.label('\tpush 7');
arr.value.push(7);

log.label('\tsplice 1, 1');
arr.value.splice(1, 1);

log.label('\tset 0 33');
arr.value[0] = 33;

log.label('\tsort');
arr.value.sort();

log.label('\tdelete 0');
delete arr.value[0];

log.label('\n<------- Object ------->');
const obj = mutable<Record<string, unknown>>({
	a: 'a',
	b: 'b',
	c: 'c',
	d: 'd',
});

log.label('\tinitial value');

log.change({ input: obj }); // <- being rerun on mutation

log.label('\tset a');
obj.value.a = 'x';
log.label('\tdelete c');
delete obj.value.c;
