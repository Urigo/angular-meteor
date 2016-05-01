Plugin.registerCompiler({
  extensions: ['html'],
  archMatching: 'web',
  isTemplate: true
}, () => new NgCachingHtmlCompiler('angular', AngularTemplates.scanner, AngularTemplates.handler));
