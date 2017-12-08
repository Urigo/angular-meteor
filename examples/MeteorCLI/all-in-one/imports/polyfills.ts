import 'core-js/es7/reflect';
const oldThen = Promise.prototype.then;
Object.defineProperty(Promise.prototype, "then", {
  set: function(){
    return;
  },
  get(){
    return oldThen;
  }
});
require('zone.js');

declare var module : any;
global['System'] = {
  import(path: string){
    return module.dynamicImport(path);
  }
}
