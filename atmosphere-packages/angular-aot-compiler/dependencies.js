import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

if((process.env.NODE_ENV == 'production') || process.env.AOT){
  checkNpmVersions({
    '@angular/core': '>4.2.6',
    '@angular/common': '>4.2.6',
    '@angular/compiler': '>4.2.6',
    '@angular/compiler-cli': '>4.2.6',
    'typescript': '>=2.4.2'
  }, 'ardatan:angular-aot-compiler');
}
