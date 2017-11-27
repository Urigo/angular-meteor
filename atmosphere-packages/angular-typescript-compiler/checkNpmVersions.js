import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
    '@angular/core': '5.x.x',
    '@angular/common': '5.x.x',
    '@angular/compiler': '5.x.x',
    '@angular/compiler-cli': '5.x.x',
    'typescript': '2.x.x',
}, 'angular-typescript-compiler');
