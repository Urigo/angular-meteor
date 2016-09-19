FileMixin = {
  getPackagePrefixedPath() {
    return this.getPackagePrefix() + this.getPathInPackage();
  },

  getPackagePrefixedModule() {
    return this.getPackagePrefix() + this.getModuleName();
  },

  getPackagePrefix() {
    var packageName = this.getPackageName();
    return packageName ? '{' + packageName + '}/' : '';
  },

  // Gets file path in the package with no extension.
  getModuleName() {
    return this.getPathInPackage().replace(
      '.' + this.getExtension(), '');
  },

  isFromNPM() {
    return !!this.getPathInPackage()
      .startsWith('node_modules');
  }
};
