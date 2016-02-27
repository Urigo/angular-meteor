describe('Annotations', function() {
  var RequireUserAnnotation;
  var CanActivate;

  beforeAll(function(done) {
    System.import('angular2/router_dev').then(function(router_dev) {
      CanActivate = router_dev.CanActivate;
      System.import('meteor-accounts').then(function(accounts) {
        RequireUserAnnotation = accounts.RequireUser;
        done();
      });
    });
  }); 

  describe('RequireUserAnnotation', function() {
    it('extends CanActivate', function() {
      var requireUser = new RequireUserAnnotation();
      expect(requireUser instanceof CanActivate).toBeTruthy();
    });
  });
});
