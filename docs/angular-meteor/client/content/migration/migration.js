Template.migration.helpers({
  migration: function () {
    return MIGRATION;
  },
  currentFramework: function(framework) {
    return this.route.indexOf(framework) !== -1 ? 'active' : '';
  },
  pages: function() {
    return this.route.indexOf("angular1") !== -1  ? MIGRATION.groups[0].pages[0].pages : MIGRATION.groups[0].pages[1].pages;
  }
});
