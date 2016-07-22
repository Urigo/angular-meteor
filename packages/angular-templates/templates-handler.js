if (!window.angular) {
  try {
    if (Package['modules-runtime']) {
      var require = Package['modules-runtime'].meteorInstall();
      require('angular');
    }
  } catch(e) {
    throw new Error('angular package is missing');
  }
}

angular.module('angular-templates', []).config([
  '$provide',
  function ($provide) {
    var templatesFileExtension = ['html', 'tpl', 'tmpl', 'template', 'view'];
    var forwardSlash = /^\//;

    $provide.decorator('$templateCache', ['$delegate', '$angularTemplatesSettings',
      function($delegate, $angularTemplatesSettings) {
        var originalGet = $delegate.get;

        $delegate.get = function(templatePath) {
          var result = originalGet(templatePath);

          if (angular.isUndefined(result)) {
            if (forwardSlash.test(templatePath) === false) {
              result = originalGet('/' + templatePath);
            }
          }

          if (angular.isUndefined(result)) {
            var fileExtension = ((templatePath.split('.') || []).pop() || '').toLowerCase();

            if (templatesFileExtension.indexOf(fileExtension) > -1) {
              function getMsg(type) {
                return '[angular-meteor][err][404] ' + templatePath + ' - HTML template does not exists! You can disable this ' + type + ' by following this guide http://www.angular-meteor.com/api/1.3.11/templates';
              }

              if ($angularTemplatesSettings.error === true) {
                throw new Error(getMsg('error'));
              } else if ($angularTemplatesSettings.warning === true) {
                console.warn(getMsg('warning'));
              }
            }
          }

          return result;
        };

        return $delegate;
    }]);
  }
]).constant('$angularTemplatesSettings', {
  error: true,
  warning: true
});
