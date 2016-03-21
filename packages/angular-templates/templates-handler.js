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

    $provide.decorator('$templateCache', ['$delegate', function($delegate) {
      var originalGet = $delegate.get;

      $delegate.get = function(templatePath) {
        var originalResult = originalGet(templatePath);

        if (angular.isUndefined(originalResult)) {
          var fileExtension = ((templatePath.split('.') || []).pop() || '').toLowerCase();

          if (templatesFileExtension.indexOf(fileExtension) > -1) {
            throw new Error('[angular-meteor][err][404] ' + templatePath + ' - HTML template does not exists!');
          }
        }

        return originalResult;
      };

      return $delegate;
    }]);
  }
]);
