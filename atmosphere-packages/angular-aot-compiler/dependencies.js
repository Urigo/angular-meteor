import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

try{
  checkNpmVersions({
    '@angular/core': '4.4.x || 5.0.x',
    '@angular/common': '4.4.x || 5.0.x',
    '@angular/compiler': '4.4.x || 5.0.x',
    '@angular/compiler-cli': '4.4.x || 5.0.x',
    'typescript': '2.x.x'
  }, 'ardatan:angular-aot-compiler');
}catch(e){
  console.error(`
    You have to install required dependencies for Angular Meteor Compiler.
      ${e.message}
    `);
}
