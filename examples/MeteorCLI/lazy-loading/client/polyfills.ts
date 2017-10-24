import 'zone.js';
import 'core-js/es7/reflect';

declare var module : any;
global['System'] = {
  import(path: string){
    return module.dynamicImport(path);
  }
}
