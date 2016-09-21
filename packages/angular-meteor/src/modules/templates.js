export const name = 'angular-templates';

try {
  angular.module(name);
} catch (e) {
  angular.module(name, []);
}
