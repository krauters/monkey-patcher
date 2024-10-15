/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

export class MonkeyPatcher<T extends object> {
	private static readonly prefix: string = '[MonkeyPatcher] '
	public methodNames: string[] = []
	public namespace: string
	public prototype: T
	public targetName: string

	/**
	 * Initializes the MonkeyPatcher with the target prototype and namespace.
	 *
	 * @param prototype The prototype that will be monkey patched.
	 * @param namespace The namespace under which methods will be added.
	 */
	constructor(prototype: T, namespace: string) {
		this.prototype = prototype
		this.targetName = prototype.constructor.name
		this.namespace = namespace
	}

	/**
	 * Retrieves all methods from a given class instance.
	 * @param cls The class instance from which to retrieve methods.
	 * @returns An object mapping method names to their corresponding functions.
	 */
	public static getMethods<U extends object>(cls: U): Record<string, Function> {
		return Object.getOwnPropertyNames(cls)
			.filter((prop) => typeof (cls as any)[prop] === 'function' && prop !== 'constructor')
			.reduce<Record<string, Function>>((acc, prop) => {
				acc[prop] = (cls as any)[prop]

				return acc
			}, {})
	}

	/**
	 * Creates a Proxy for the namespace to handle method calls.
	 *
	 * @param methods The methods to include in the namespace.
	 * @returns A proxy handler for method interception.
	 */
	private createNamespaceProxy(methods: Record<string, Function>): object {
		return new Proxy(
			{},
			{
				get: (_target, prop: string | symbol) => {
					if (typeof prop === 'symbol') {
						throw new Error(`Symbol properties are not supported in namespace [${this.namespace}].`)
					}

					const method = methods[prop]
					if (typeof method === 'function') {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-return
						return method.bind(this.prototype)
					}

					throw new Error(`Method [${String(prop)}] not found in namespace [${this.namespace}].`)
				},
			},
		)
	}

	/**
	 * Logs a message indicating which methods have been patched.
	 *
	 * @returns The log message.
	 */
	public log(message: string): void {
		console.log(`${MonkeyPatcher.prefix}${message}`)
	}

	/**
	 * Patches the target prototype by adding methods under the specified namespace.
	 *
	 * @param cls The class instance from which to retrieve methods to patch.
	 * @throws Will throw an error if the namespace already exists or if cls has no methods.
	 */
	public patch<U extends object>(cls: U): void {
		const methods = MonkeyPatcher.getMethods(cls)

		if (Object.keys(methods).length === 0) {
			throw new Error(`No methods found in the provided class to patch under namespace [${this.namespace}].`)
		}

		if (this.namespace in this.prototype) {
			throw new Error(`Namespace [${this.namespace}] already exists on the target prototype.`)
		}

		Object.defineProperty(this.prototype, this.namespace, {
			configurable: true,
			enumerable: false,
			get: () => this.createNamespaceProxy(methods),
		})

		this.methodNames = Object.keys(methods)
		this.log(
			`Patched [${this.targetName}] with methods [${this.methodNames.join(', ')}] under namespace [${this.namespace}].`,
		)
	}
}
