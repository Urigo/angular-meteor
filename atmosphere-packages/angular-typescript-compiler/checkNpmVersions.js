import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
    '@angular/core': '5.0.x',
    '@angular/common': '5.0.x',
    '@angular/compiler': '5.0.x',
    '@angular/compiler-cli': '5.0.x',
    'typescript': '2.x.x',
}, 'angular-typescript-compiler');
