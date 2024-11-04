<div align="center">

![Code Size](https://img.shields.io/github/languages/code-size/krauters/monkey-patcher)
![Commits per Month](https://img.shields.io/github/commit-activity/m/krauters/monkey-patcher)
![Contributors](https://img.shields.io/github/contributors/krauters/monkey-patcher)
![Forks](https://img.shields.io/github/forks/krauters/monkey-patcher)
![GitHub Stars](https://img.shields.io/github/stars/krauters/monkey-patcher)
![Install Size](https://img.shields.io/npm/npm/dw/@krauters%2Fmonkey-patcher)
![GitHub Issues](https://img.shields.io/github/issues/krauters/monkey-patcher)
![Last Commit](https://img.shields.io/github/last-commit/krauters/monkey-patcher)
![License](https://img.shields.io/github/license/krauters/monkey-patcher)
<a href="https://www.linkedin.com/in/coltenkrauter" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?&style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
[![npm version](https://img.shields.io/npm/v/@krauters%2Fmonkey-patcher.svg?style=flat-square)](https://www.npmjs.org/package/@krauters/monkey-patcher)
![Open PRs](https://img.shields.io/github/issues-pr/krauters/monkey-patcher)
![Repo Size](https://img.shields.io/github/repo-size/krauters/monkey-patcher)
![Version](https://img.shields.io/github/v/release/krauters/monkey-patcher)
![visitors](https://visitor-badge.laobi.icu/badge?page_id=krauters/monkey-patcher)

</div>

# @krauters/monkey-patcher

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
		monkey-patcher: {
			reverse(): string
			capitalize(): string
		}
	}
}

// 3. Create a MonkeyPatcher instance with the desired namespace
const stringPatcher = new MonkeyPatcher(String.prototype, 'monkey-patcher')

// 4. Patch the String class with the new methods
stringPatcher.patch(stringMethods)

// 5. Use the patched methods
const str = new String('hello world')

// Access existing method
console.log(str.toUpperCase()) // Output: HELLO WORLD

// Use patched methods under the 'monkey-patcher' namespace
console.log(str.monkey-patcher.reverse()) // Output: dlrow olleh
console.log(str.monkey-patcher.capitalize()) // Output: Hello world
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

<br />
<br />
<a href="https://www.buymeacoffee.com/coltenkrauter"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=coltenkrauter&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a>
