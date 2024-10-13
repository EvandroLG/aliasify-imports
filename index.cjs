const path = require('node:path');
const process = require('node:process');

/**
 * Transforms relative import paths to use a specified alias based on the source directory.
 *
 * @param {Object} fileInfo - Information about the file being transformed.
 * @param {string} fileInfo.path - The path of the file being transformed.
 * @param {string} fileInfo.source - The source code of the file.
 * @param {Object} api - The jscodeshift API.
 * @param {Object} options - Transformation options.
 * @param {string} [options.srcDir='src'] - The name of the source directory to base absolute imports on.
 * @param {string} [options.alias='@'] - The alias to use for converting import paths.
 * @returns {string} - The transformed source code with updated import paths.
 */
module.exports = function (fileInfo, api, options) {
  const srcDirName = options.srcDir || 'src';
  const alias = options.alias || '@';
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  const srcDir = path.resolve(process.cwd(), srcDirName);

  root.find(j.ImportDeclaration).forEach((pathNode) => {
    const importPath = pathNode.value.source.value;

    if (importPath.startsWith('.')) {
      const absoluteImportPath = path.resolve(
        path.dirname(fileInfo.path),
        importPath
      );

      if (absoluteImportPath.startsWith(srcDir)) {
        const relativePathFromSrc = path
          .relative(srcDir, absoluteImportPath)
          .replace(/\\/g, '/');
        const newImportPath = `${alias}/${relativePathFromSrc}`;
        pathNode.value.source.value = newImportPath;
      }
    }
  });

  return root.toSource();
};
