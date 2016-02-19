export const module = 'angular-templates';

try {
  angular.module(module);
} catch (e) {
  angular.module(module, []);
}
