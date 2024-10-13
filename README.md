# aliasify-imports &middot; [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

A codemod that swaps relative imports for aliases — your go-to buddy for project refactoring!

## Installation

```sh
npm install -g aliasify-imports
```

## Usage

Run the transformation on your source directory:

```sh
jscodeshift -t aliasify-imports.js src
```

## CLI Options

- `--alias` (Default: `@`) - The alias to use for the import paths.
- `--srcDir` (Default: `src`) - The source directory to use for the alias.
- `--parser` (Default: 'tsx') - The parser to use
- `--extensions` (Default: 'js,jsx,ts,tsx') - The file extensions to transform
- `--help` - Display the help message

## Example

### Before

```js
// In src/components/Header/index.js

import Logo from '../../assets/images/logo.png';
import Utils from '../../../utils/helpers';
import Footer from '../Footer';
```

### After

```js
// In src/components/Header/index.js

import Logo from '@/assets/images/logo.png';
import Utils from '@/utils/helpers';
import Footer from '@/components/Footer';
```

## License

[MIT](./LICENSE)
