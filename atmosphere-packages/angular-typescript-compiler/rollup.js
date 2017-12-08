const path = Npm.require('path');
const baseRollup = Npm.require('rollup').rollup;
const Hypothetical = Npm.require('rollup-plugin-hypothetical');
const CommonJS = Npm.require('rollup-plugin-commonjs');
const NodeResolve = Npm.require('rollup-plugin-node-resolve');

import {getMeteorPath, isRooted, getNoRooted} from './file-utils';

const EXCLUDE_MODULES = ['node_modules/zone.js/**'];

const AppResolve = (appNgModules, exclude, forWeb) => {
  const exlRegExp = new RegExp(`^(${exclude.join('|')})$`);
  const nodeResolve = NodeResolve({
    jsnext: true,
    module: true,
    browser: forWeb,
  });
  return {
    resolveId(importee, importer) {
      if (! importer) return null;

      let modId = importee;

      // Relative path.
      if (importee[0] === '.') {
        modId = path.resolve(importer, '..', importee);
        modId = getMeteorPath(modId);
      }

      // Rooted path.
      if (isRooted(importee)) {
        modId = getMeteorPath(importee);
      }

      if (appNgModules.has(modId)) {
        return Promise.resolve(modId);
      }

      const index = path.join(modId, 'index');
      if (appNgModules.has(index)) {
        return Promise.resolve(index);
      }

      const parts = importee.split(/[\/\\]/);
      modId = parts.shift();

      // Skip bundling packages to exclude.
      if (exlRegExp.test(modId)) {
        return null;
      }

      return nodeResolve.resolveId(importee, importer);
    },
    load(modId) {
      if (appNgModules.has(modId)) {
        return Promise.resolve(appNgModules.get(modId));
      }

      return null;
    }
  }
};

export default function rollup(
  appNgModules, bootstrapModule, mainCodePath, exclude, namedExports, forWeb) {
  return baseRollup({
    entry: mainCodePath,
    onwarn: (warn) => {},
    plugins: [
      Hypothetical({
        files: {
          [mainCodePath]: bootstrapModule,
        },
        allowRealFiles: true
      }),
      AppResolve(appNgModules,
        ['meteor'].concat(exclude || []), forWeb),
      CommonJS({
        sourceMap: false,
        exclude: EXCLUDE_MODULES,
        namedExports: namedExports || {},
      })
    ]
  })
  .then(bundle => {
    const result = bundle.generate({
      format: 'umd',
      moduleName: 'app',
    });
    return result.code;
  })
  .catch(error => {
    console.log(error)
    return null;
  })
  .await();
}