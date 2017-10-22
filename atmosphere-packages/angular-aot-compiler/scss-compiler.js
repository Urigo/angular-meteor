import path from 'path';
import sass from 'node-sass';

const basePath = process.cwd();

export class AngularAotScssCompiler {
  compileFileByUrl(scssUrl){
    try{
      const results = sass.renderSync({
        file: path.join(basePath, scssUrl),
        includePaths: [path.join(basePath, 'node_modules')]
      });
      return results.css.toString('utf-8');
    }catch({ path, line, column, message }){
      const msg = `${fileName} (${line}, ${column}): ${message}`;
      console.error(msg);
    }
  }
}
