import mutable from './lib/mutable';

const input = mutable([1, 2, 3]);

input.onChange((...args) => {
	console.log(...args);
	console.log('=================');
});

console.log('push 7');
input.value.push(7);
console.log('splice 1, 1');
input.value.splice(1, 1);
console.log('set 0 33');
input.value[0] = 33;
console.log('sort');
input.value.sort();
console.log('delete 0');
delete input.value[0];

const obj = mutable<Record<string, unknown>>({
	a: 'a',
	b: 'b',
	c: 'c',
	d: 'd',
});

obj.onChange((...args) => {
	console.log(...args);
	console.log('=================');
});

console.log('set a');
obj.value.a = 'x';
console.log('delete c');
delete obj.value.c;
