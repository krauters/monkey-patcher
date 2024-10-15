# Monkey Patcher

**MonkeyPatcher** is a powerful TypeScript utility designed to help developers extend class prototypes by adding new methods under a specified namespace. This approach enhances the flexibility and extensibility of codebases without altering the original class implementations. By encapsulating additional functionalities within a clear namespace, **MonkeyPatcher** promotes organized and maintainable code patching.

While monkey patching can be incredibly useful, it's crucial to avoid falling into common anti-patterns. Always ensure that the added functionalities are well-organized and do not interfere with existing methods, and please group them into reasonable namespaces to make their usage more intuitive.

```zsh
npm install @krauters/monkey-patcher
```

## Usage

To use **MonkeyPatcher**, first define the new methods you want to add to a target class and extend the class's interface with a unique namespace. Then, create a `MonkeyPatcher` instance with the class prototype and namespace, apply the patch, and access the new methods through the designated namespace on class instances.

```ts
// Usage Example: Patching String with MonkeyPatcher

import { MonkeyPatcher } from 'monkey-patcher'

// 1. Define new methods to add to String
const stringMethods = {
	reverse(this: String): string {
		return this.split('').reverse().join('')
	},
	capitalize(this: String): string {
		if (this.length === 0) return ''
		return this.charAt(0).toUpperCase() + this.slice(1)
	},
}

// 2. Extend the String interface to include the new namespace
declare global {
	interface String {
		utils: {
			reverse(): string
			capitalize(): string
		}
	}
}

// 3. Create a MonkeyPatcher instance with the desired namespace
const stringPatcher = new MonkeyPatcher(String.prototype, 'utils')

// 4. Patch the String class with the new methods
stringPatcher.patch(stringMethods)

// 5. Use the patched methods
const str = new String('hello world')

// Access existing method
console.log(str.toUpperCase()) // Output: HELLO WORLD

// Use patched methods under the 'utils' namespace
console.log(str.utils.reverse()) // Output: dlrow olleh
console.log(str.utils.capitalize()) // Output: Hello world
```

## Husky

Husky helps manage Git hooks easily, automating things like running tests or linting before a commit is made. This ensures your code is in good shape.

Pre-commit hooks run scripts before a commit is finalized to catch issues or enforce standards. With Husky, setting up these hooks across your team becomes easy, keeping your codebase clean and consistent.

### Our Custom Pre-Commit Hook

This project uses a custom pre-commit hook to run `npm run bundle`. This ensures that our bundled assets are always up to date before any commit (which is especially important for TypeScript GitHub Actions). Husky automates this, so no commits will go through without a fresh bundle, keeping everything streamlined.

## Contributing

The goal of this project is to continually evolve and improve its core features, making it more efficient and easier to use. Development happens openly here on GitHub, and we’re thankful to the community for contributing bug fixes, enhancements, and fresh ideas. Whether you're fixing a small bug or suggesting a major improvement, your input is invaluable.

## License

This project is licensed under the ISC License. Please see the [LICENSE](./LICENSE) file for more details.

## 🥂 Thanks Contributors

Thanks for spending time on this project.

<a href="https://github.com/krauters/monkey-patcher/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=krauters/monkey-patcher" />
</a>
