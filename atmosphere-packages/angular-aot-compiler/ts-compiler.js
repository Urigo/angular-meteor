import fs from 'fs';
import path from 'path';

import ts from'typescript';

import {
  createCompilerHost,
  createProgram,
  TsCompilerAotCompilerTypeCheckHostAdapter
} from '@angular/compiler-cli';

import {
  toTypeScript
} from '@angular/compiler';

import sass from 'node-sass';

import { TSBuild } from 'meteor-typescript';

const { rollup : baseRollup } = Npm.require('rollup');
import Hypothetical from 'rollup-plugin-hypothetical';
import CommonJS from 'rollup-plugin-commonjs';
import NodeResolve from 'rollup-plugin-node-resolve';

const basePath = process.cwd();

// using: regex, capture groups, and capture group variables.

const ROOTED = /^(\/|\\)/;

const SCSS_REGEX = /\.scss$/;

const LOAD_CHILDREN_REGEX = /loadChildren\s*:(\s*['"`](.*?)['"`]\s*([,}]))/gm;
const STRING_REGEX = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

const WEB_ARCH_REGEX = /^web/;

const ngCompilerOptions = {
  transitiveModules: true
};

const tcOptions = {
  baseUrl: basePath,
  experimentalDecorators: true,
  module: 'commonjs',
  target: 'es2015',
  noImplicitAny: false,
  moduleResolution: 'node',
  emitDecoratorMetadata: true,
  traceResolution: false
};

const ngcOptions = {
  basePath,
  genDir: basePath,
  generateCodeForLibraries: true,
  traceResolution: false,
};

const EXCLUDE_MODULES = ['node_modules/zone.js/**'];

function getMeteorPath(filePath) {
  if (filePath.startsWith(basePath)) {
    filePath = filePath.slice(basePath.length);
  }
  return getNoRooted(filePath);
}
function getNoRooted(filePath) {
  if (isRooted(filePath)) {
    return filePath.slice(1);
  }
  return filePath;
}
function isRooted(filePath) {
  return ROOTED.test(filePath);
}

function AppResolve(appNgModules, exclude, forWeb){
    const exlRegExp = new RegExp(`^(${exclude.join('|')})$`);
    const nodeResolve = NodeResolve({
      jsnext: true,
      module: true,
      browser: forWeb,
    });
    return {
      async resolveId(importee, importer) {
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
          return modId;
        }

        const index = path.join(modId, 'index');
        if (appNgModules.has(index)) {
          return index;
        }

        const parts = importee.split(/[\/\\]/);
        modId = parts.shift();

        // Skip bundling packages to exclude.
        if (exlRegExp.test(modId)) {
          return null;
        }

        return nodeResolve.resolveId(importee, importer);
      },
      async load(modId) {
        if (appNgModules.has(modId)) {
          return appNgModules.get(modId);
        }

        return null;
      }
    }
  };

export class AngularAotTsCompiler extends TypeScriptCompiler {
  replaceStringsWithFullUrls(basePath, urls){
      return urls
      .replace(STRING_REGEX,
        (match, quote, url) => `'/${path.join(basePath, url)}'`);
  }
  addFakeDynamicLoader(tsFile, source){

    source = source || tsFile.getContentsAsString();
    const basePath = tsFile.getPathInPackage().replace(tsFile.getBasename(), '');

    let fakeLoaderCode = '';

    let newSource = source.replace(LOAD_CHILDREN_REGEX,
        (match, url) => {
          const replaced = this.replaceStringsWithFullUrls(basePath, url).trim();
          const fixedUrl = (replaced
                              .split('#')[0]) + '.ngfactory' + replaced[0];

          fakeLoaderCode += `function fakeLoader(){module.dynamicImport(${fixedUrl})}`;
          return `loadChildren: ${replaced}`;
        })

    if(fakeLoaderCode)
          newSource = fakeLoaderCode + '\n' + newSource;

    return newSource;

  }
  processFilesForTarget(inputFiles){
        const forWeb = WEB_ARCH_REGEX.test(inputFiles[0].getArch());
        // Get app ts-files.
        const tsFiles = super.getFilesToProcess(inputFiles);
        const inputTsFiles = inputFiles.filter(inputFile => inputFile.getPathInPackage().endsWith('.d.ts'));
        for(const inputFile of inputTsFiles){
          const tsFilePath = inputFile.getPathInPackage().replace('.d', '');
          if(!tsFiles.includes(tsFilePath)){
            try{
              const source = fs.readFileSync(path.join(basePath, tsFilePath), 'utf8')
              tsFiles.push(inputFile)
              //console.log('Added as TS file before compiled:' + tsFilePath)
            }catch(e){
              const jsFilePath = tsFilePath.replace('.ts', '.js');
              try{
                const source = fs.readFileSync(path.join(basePath, jsFilePath), 'utf8');
                const result = Babel.compile(source);
                //console.log('Added as JS file before compiled:' + jsFilePath)
                inputFile.addJavaScript({
                  path: jsFilePath,
                  data: result.code
                })
              }catch(e){
                  //console.log('JS version is not found!' + jsFilePath);
              }
            }
          }
        }
        const tsFilePaths = tsFiles.map(file => file.getPathInPackage());
        //console.log(tsFilePaths);
        const defaultGet = this._getContentGetter(inputFiles);

        const { options } = ts.convertCompilerOptionsFromJson(tcOptions, '');
        const genOptions = Object.assign({}, options, ngcOptions);

        const fullPaths = tsFilePaths.map(filePath => path.join(basePath, filePath));
        let ngcError = null;
        const ngcFilesMap = this
            .generateCode(fullPaths, genOptions, defaultGet)
            //.catch(error => ngcError = error)
            .await();

        if (ngcError) {
          console.log('AOT Compiler Error: ' + ngcError);
          return null;
        }


        const prefix = forWeb ? 'client' : 'server';
        const ngcFilePaths = Array.from(ngcFilesMap.keys());

        const getContent = filePath => {
          return ngcFilesMap.get(filePath) ||
            defaultGet(filePath);
        }
        const buildOptions = super.getBuildOptions(inputFiles);

        const allPaths = tsFilePaths.concat(ngcFilePaths);
        const tsBuild = new TSBuild(allPaths, getContent, buildOptions);
        const codeMap = new Map();
        const tsFilePath = allPaths.filter(
          filePath => ! TypeScript.isDeclarationFile(filePath));
        let mainCode = 'main.js';
        let mainCodePath;
        for (const filePath of tsFilePath) {
          const result = tsBuild.emit(filePath, filePath);
          let code = result.code;
          if(process.env.ROLLUP){
            if (this.hasDynamicBootstrap(code)) {
              mainCode = this.removeDynamicBootstrap(code);
              mainCodePath = this.removeTsExtension(filePath) + '.js';
              continue;
            }
            if(!mainCode && filePath.endsWith('main.ts')){
              mainCode = result.code;
              continue;
            }
            codeMap.set(this.removeTsExtension(filePath), code);
          }else{
          const origTargetFilePath =
            this.removeTsExtension(
              getNoRooted(filePath)
            )
            .replace('.ngfactory', '')
            .replace('.shim.ngstyle', '');
            const inputFile = inputFiles.find(file => {
              const origSourceFilePath =
                  this.removeTsExtension(
                    getNoRooted(
                      file.getPathInPackage()
                    )
                  )
                  .replace('.d', '');
              return origTargetFilePath == origSourceFilePath;
            }) || inputFiles.find(file => {
                const filePath = file.getPathInPackage();
                return filePath.startsWith(prefix) &&
                       filePath.includes('imports');
              });
            this._processTsDiagnostics(result.diagnostics,inputFile);
            if (this.hasDynamicBootstrap(code)) {
              code = this.removeDynamicBootstrap(code);
            }
            code = this.addFakeDynamicLoader(inputFile, code);
            code = code
              .split('require("node_modules')
              .join('require("/node_modules')
            const inputPath = inputFile.getPathInPackage();
            const outputPath = this.removeTsExtension(filePath);
            const toBeAdded = {
              sourcePath: inputPath,
              path: outputPath + '.js',
              data: code,
              hash: result.hash,
              sourceMap: result.sourceMap
            };
            inputFile.addJavaScript(toBeAdded);
          }
        }
        if(process.env.ROLLUP){
          const tsconfig = this.tsconfig;
          const exclude = !!tsconfig.angularCompilerOptions &&
            tsconfig.angularCompilerOptions.exclude;
          const namedExports = !!tsconfig.angularCompilerOptions &&
            tsconfig.angularCompilerOptions.namedExports;


          let rollupError;
          const bundle = this.rollup(codeMap, mainCode, mainCodePath,
            exclude, namedExports, forWeb)
            .catch(error => rollupError = error)
            .await();

          if(rollupError){
            console.log('Rollup Error: ' + rollupError);
            return null;
          }
          if (bundle) {
            // Look for a ts-file in the client or server
            // folder to add generated bundle.
            const inputFile = tsFiles.find(file => {
                const filePath = file.getPathInPackage();
                return filePath.startsWith(prefix) &&
                       filePath.indexOf('imports') === -1;
              });
            const toBeAdded = {
              sourcePath: inputFile.getPathInPackage(),
              path: 'bundle.js',
              data: bundle
            };
            inputFile.addJavaScript(toBeAdded);
          }
        }
  }
  _getContentGetter(inputFiles) {
    const filesMap = new Map;
    for(const index in inputFiles){
      const inputFile = inputFiles[index];
      const filePath = inputFile.getPathInPackage();
      filesMap.set(filePath, index);
    }

    return filePath => {
      filePath = getMeteorPath(filePath);

      let index = filesMap.get(filePath);
      let content = null;
      if (index === undefined) {
        const filePathNoRootSlash = filePath.replace(/^\//, '');
        index = filesMap.get(filePathNoRootSlash);
      }
      if(index === undefined){
        try{
          content = fs.readFileSync(filePath, 'utf8');
        }catch(e){
        }
      }else{
        content = inputFiles[index].getContentsAsString();
      }
      return content;
    };
  }
  _processTsDiagnostics(diagnostics, inputFile) {
    diagnostics.semanticErrors.forEach(error => inputFile.error);
  }
  async generateCode(filePaths, ngcOptions, getMeteorFileContent) {
    const tsHost = this.createNgcTsHost(ngcOptions, getMeteorFileContent);
    const tsProgram = this.createNgcTsProgram(filePaths, ngcOptions, tsHost);
    const compilerHostContext = this.createCompilerHostContext(tsHost);
    const usePathMapping = !!ngcOptions.rootDirs && ngcOptions.rootDirs.length > 0;
    const compilerHost = this.createCompilerHost(
      tsProgram, ngcOptions, compilerHostContext, usePathMapping);

    const { compiler } =
      createProgram({
        rootNames:filePaths,
        options: ngcOptions,
        host: compilerHost
      });
    compiler._host._loadResource = compiler._host.loadResource;
    compiler._host.loadResource = function(filePath){
      let data = getMeteorFileContent(filePath);
      if(data && SCSS_REGEX.test(filePath)){
        try{
          const result  = sass.renderSync({
            file: isRooted(filePath) ?
            filePath : path.join(basePath, filePath),
            data,
            includePaths: [basePath + '/node_modules']
          });
          data = result.css.toString('utf8');
        }catch(e){
          inputFile.error(e);
        }
      }
      if(!data){
        data = compiler._host._loadResource(filePath);
      }
      return data;
    }
    const ngcFilePaths = tsProgram.getSourceFiles().map(sf => sf.fileName);

    const analyzeResult = await compiler.analyzeModulesAsync(ngcFilePaths);
    const generatedModules = await compiler.emitAllImpls(analyzeResult);

    const ngcFilesMap = new Map();
    for(const generatedModule of generatedModules){
      // Filter out summary json files generated by the compiler.
      if (! (generatedModule.genFileUrl.includes('.json')) && !(generatedModule.genFileUrl.includes('ngsummary'))) {
        const filePath = getMeteorPath(generatedModule.genFileUrl);
        ngcFilesMap.set(
          filePath,
          generatedModule.source ||
          toTypeScript(
            generatedModule,`
             /**
              * @fileoverview This file is generated by the Angular template compiler.
              * Do not edit.
              * @suppress {suspiciousCode,uselessCode,missingProperties,missingOverride}
              */
             /* tslint:disable */
              `)
        );
      }
    }
    return ngcFilesMap;
  }
  createNgcTsHost(ngcOptions, getFileContent) {
    const defaultHost = ts.createCompilerHost(ngcOptions, true);
    const customHost = {
      getSourceFile: (filePath, languageVersion, onError) => {
        const content = getFileContent(filePath);
        if (content) {
          return ts.createSourceFile(filePath, content, languageVersion, true);
        }
        return defaultHost.getSourceFile(filePath, languageVersion, onError);
      },
      realpath: filePath => filePath,
      fileExists: filePath => {
        const exists = defaultHost.fileExists(filePath);
        return exists || !!getFileContent(filePath);
      },
      directoryExists: dirName => {
        const exists = defaultHost.directoryExists(dirName);
        return exists || !!getFileContent(path.join(dirName, 'index.ts'));
      },
      trace: msg => {
        console.log(msg);
      },
    };

    const ngcHost = Object.assign({}, defaultHost, customHost);
    return ngcHost;
  }
  createNgcTsProgram(filePaths, ngcOptions, ngcHost) {
    const program = ts.createProgram(filePaths, ngcOptions, ngcHost);
    const getSourceFile = program.getSourceFile;
    program.getSourceFile = filePath => {
      let sf = getSourceFile.call(this, filePath);
      if (sf) return sf;

      filePath = getMeteorPath(filePath);
      return getSourceFile.call(this, filePath);
    };

    return program;
  }
  createCompilerHostContext(ngcHost) {
    const assumedExists = {};
    let reflectorContext = {
      fileExists(filePath) {
        return assumedExists[filePath] || ngcHost.fileExists(filePath);
      },
      assumeFileExists(filePath) {
        assumedExists[filePath] = true;
      },
      async readResource(filePath) {
        if (! ngcHost.fileExists(filePath)) {
          throw new Error(`Compilation failed. Resource file not found: ${filePath}`);
        }
        return ngcHost.readFile(filePath);
      }
    }
    return Object.assign({}, ngcHost, reflectorContext);
  }
  createCompilerHost(tsProgram, ngcOptions, compilerHostContext, usePathMapping) {
      return createCompilerHost({
        options: ngcOptions,
        host: compilerHostContext
      })
  }
  removeTsExtension(filePath) {
    if (filePath.endsWith('.ts')) {
      return filePath.slice(0, -3);
    }
    return filePath;
  }
  hasDynamicBootstrap(code) {
    return code.indexOf('platform-browser-dynamic') !== -1 ||
           code.indexOf('DynamicServer') !== -1 ||
           code.indexOf('renderModule(') !== -1;
  }
  removeDynamicBootstrap(code) {
    function replaceAll(str, find, replace) {
        return str.split(find).join(replace)
    }
    code = replaceAll(code, 'platform-browser-dynamic', 'platform-browser');
    code = replaceAll(code, 'platformBrowserDynamic', 'platformBrowser');
    code = replaceAll(code, 'platformDynamicServer', 'platformServer');
    code = replaceAll(code, 'bootstrapModule', 'bootstrapModuleFactory');
    code = replaceAll(code, 'renderModule', 'renderModuleFactory');
    code = replaceAll(code, 'app.module', 'app.module.ngfactory');
    code = replaceAll(code, 'AppModule', 'AppModuleNgFactory');
    return code;
  }
  async rollup(appNgModules, bootstrapModule, mainCodePath, exclude, namedExports, forWeb) {
    const bundle = await baseRollup({
      entry: mainCodePath,
      onwarn(warn){
        //console.log('Rollup Warn: ' + warn);
      },
      plugins: [
        Hypothetical({
          files: {
            [mainCodePath]: bootstrapModule,
          },
          allowRealFiles: true,
        }),
        AppResolve(appNgModules,
          ['meteor'].concat(exclude || []), forWeb),
        CommonJS({
          sourceMap: false,
          exclude: EXCLUDE_MODULES,
          namedExports: namedExports || {},
        })
      ]
    });
    const result = await bundle.generate({
        format: 'umd',
        moduleName: 'app',
     });
    return result.code;
  }
}
