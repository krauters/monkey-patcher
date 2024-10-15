import { describe, it, expect, beforeEach, afterAll, jest } from '@jest/globals'
import { MonkeyPatcher } from '../src/index'

class SampleClass {
	existingMethod() {
		return 'Original Method'
	}

	anotherExistingMethod() {
		return 'Another Original Method'
	}
}

interface SampleClassWithKrauters extends SampleClass {
	krauters: {
		newMethod(arg: string): string
		anotherMethod(): string
	}
}

const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {})

describe('MonkeyPatcher', () => {
	const newMethods = {
		newMethod(this: SampleClass, arg: string) {
			return `New Method called with ${arg}`
		},
		anotherMethod(this: SampleClass) {
			return 'Another New Method'
		},
	}

	let patcher: MonkeyPatcher<SampleClass>
	let sampleInstance: SampleClassWithKrauters

	beforeEach(() => {
		jest.resetAllMocks()
        delete (SampleClass.prototype as any).krauters
		patcher = new MonkeyPatcher(SampleClass.prototype, 'krauters')
		sampleInstance = new SampleClass() as SampleClassWithKrauters
	})

	afterAll(() => {
		consoleLogMock.mockRestore()
	})

	describe('Constructor', () => {
		it('should initialize properties correctly', () => {
			expect(patcher.prototype).toBe(SampleClass.prototype)
			expect(patcher.namespace).toBe('krauters')
			expect(patcher.targetName).toBe('SampleClass')
			expect(patcher.methodNames).toEqual([])
		})
	})

	describe('getMethods', () => {
		it('should extract methods correctly from a class instance', () => {
			const methods = MonkeyPatcher.getMethods(newMethods)
			expect(methods).toHaveProperty('newMethod')
			expect(methods).toHaveProperty('anotherMethod')
			expect(typeof methods.newMethod).toBe('function')
			expect(typeof methods.anotherMethod).toBe('function')
		})

		it('should exclude non-function properties and constructor', () => {
			const mixedObj = {
				method1: () => {},
				method2: function() {},
				property1: 'value',
				property2: 123,
				constructor: function() {},
			}

			const methods = MonkeyPatcher.getMethods(mixedObj)

			expect(methods).toHaveProperty('method1')
			expect(methods).toHaveProperty('method2')
			expect(methods).not.toHaveProperty('property1')
			expect(methods).not.toHaveProperty('property2')
			expect(Object.keys(methods)).not.toContain('constructor')
		})
	})

	describe('patch', () => {
		it('should patch the prototype with new methods under the specified namespace', () => {
			patcher.patch(newMethods)

			expect(patcher.methodNames).toEqual(['newMethod', 'anotherMethod'])
			expect(consoleLogMock).toHaveBeenCalledWith(
				'[MonkeyPatcher] Patched [SampleClass] with methods [newMethod, anotherMethod] under namespace [krauters].'
			)

			const typedInstance = sampleInstance as SampleClassWithKrauters
			expect(typeof typedInstance.krauters.newMethod).toBe('function')
			expect(typeof typedInstance.krauters.anotherMethod).toBe('function')
		})

		it('should throw an error if no methods are found to patch', () => {
			const emptyMethods = {}

			expect(() => patcher.patch(emptyMethods)).toThrowError(
				'No methods found in the provided class to patch under namespace [krauters].'
			)
		})

		it('should throw an error if the namespace already exists on the prototype', () => {
			patcher.patch(newMethods)

			expect(() => patcher.patch(newMethods)).toThrowError(
				'Namespace [krauters] already exists on the target prototype.'
			)
		})
	})

	describe('Proxy Functionality', () => {
		beforeEach(() => {
			patcher.patch(newMethods)
		})

		it('should correctly bind methods to the prototype instance', () => {
			const typedInstance = sampleInstance as SampleClassWithKrauters

			const result1 = typedInstance.krauters.newMethod('test')
			expect(result1).toBe('New Method called with test')

			const result2 = typedInstance.krauters.anotherMethod()
			expect(result2).toBe('Another New Method')
		})

		it('should throw an error when accessing a non-existent method', () => {
			const typedInstance = sampleInstance as SampleClassWithKrauters

			expect(() => {
				;(typedInstance.krauters as any).nonExistentMethod()
			}).toThrowError("Method [nonExistentMethod] not found in namespace [krauters].")
		})

		it('should throw an error when accessing a symbol property', () => {
			const typedInstance = sampleInstance as SampleClassWithKrauters
			const sym = Symbol('testSymbol')

			expect(() => {
				;(typedInstance.krauters as any)[sym]()
			}).toThrowError("Symbol properties are not supported in namespace [krauters].")
		})
	})
})
