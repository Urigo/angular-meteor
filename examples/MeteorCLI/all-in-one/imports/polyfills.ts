import 'core-js/es7/reflect';

if(Meteor.isClient){
  require('zone.js');
}

declare var module : any;
global['System'] = {
  import(path: string){
    return module.dynamicImport(path);
  }
}
