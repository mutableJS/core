function isRegularObject(input: unknown): input is object {
	return (
		typeof input === 'object' &&
		!!input &&
		'constructor' in input &&
		input.constructor === Object &&
		Object.getPrototypeOf(input) === Object.prototype
	);
}

export default isRegularObject;
