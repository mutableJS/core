function isMutableObjectValue(input: unknown): input is object | unknown[] {
	return (
		typeof input === 'object' &&
		!!input &&
		(('constructor' in input &&
			input.constructor === Object &&
			Object.getPrototypeOf(input) === Object.prototype) ||
			Array.isArray(input))
	);
}

export default isMutableObjectValue;
