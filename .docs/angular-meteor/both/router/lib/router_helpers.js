// -------------------
// createSubRoutes
// Takes the particular structured data array and creates IR routes for all pages
// Example structure can be seen in both/router/subroutes/caseStudies.js
// -------------------
createSubRoutes = function (content) {

  var createRoute = function (d) {
    var routeOptions = {
      template: d.template,
      name: d.route,
      data: function () {
        return d;
      }
    };
    d.seoTitle    ? routeOptions.seoTitle   = d.seoTitle : false;
    d.seoAuthor   ? routeOptions.seoAuthor  = d.seoAuthor : false;
    d.seoDesc     ? routeOptions.seoDesc    = d.seoDesc : false;
    d.seoType     ? routeOptions.seoType    = d.seoType : false;
    d.seoImage    ? routeOptions.seoImage   = d.seoImage : false;
    d.seoTwitter  ? routeOptions.seoTwitter = d.seoTwitter : false;
    if(d.pathRedirect) {
      routeOptions.action = function() {
        this.redirect(d.pathRedirect);
      }
    }
    return routeOptions;
  };

  function pageReduce (group, page) {
    page.template = page.template || group.template;
    page.seoDesc = page.seoDesc || group.seoDesc;
    page.seoType = page.seoType || group.seoType;
    page.seoImage = page.seoImage || group.seoImage;
    page.seoTwitter = page.seoTwitter || group.seoTwitter;
    page.template = page.template || group.template;
    page.seoTitle = (group.seoTitlePrefix || '') + (page.seoTitle || group.seoTitle || page.title) + (group.seoTitleSuffix || '');
    page.parent = group;
    return page;
  }

  _.forEach(content.pages, function(page) {
    Router.map(function() {
      this.route(page.path, createRoute(page));
    });
  });

  _.forEach(content.groups, function(group) {
    _.forEach(group.pages, function(page) {
      Router.map(function() {
        var redPage = pageReduce(group, page);
        this.route(redPage.path, createRoute(redPage));
      });
    });
  });

  _.forEach(content.groups, function(group) {
    _.forEach(group.pages, function(parentPage) {
      _.forEach(parentPage.pages, function(page) {
        Router.map(function () {
          var redPage = pageReduce(parentPage, page);
          this.route(redPage.path, createRoute(redPage));
        });
      });
    });
  });
};



// -------------------
// Route Redirect
// -------------------
redirect = function (from, to) {
  Router.map(function(){
    var name = from.replace('/', '');
    this.route(name, {
      path: from,
      action: function () {
        this.redirect(to);
      }
    });
  });
};

// -------------------
// Create or change header meta tags
// You can set the metadata for each page in it's route.
// Available keys are: seoTitle, seoDesc, seoAuthor, seoImage, seoType, seoTwitter
// Set default key values in Router:configure()
// Set page specific key values on each route, if a key is not specified the default will be inserted
// -------------------
setSeo = function () {

  function setAttr(element, attr) {
    var irOption = Router._currentController.lookupOption(attr);
    if(irOption) {
      return element.setAttribute('content', irOption);
    } else {
      return element.setAttribute('content', attr);
    }
  }

  function setMeta(name, attr, nameType) {
    var nameType = nameType ? nameType : 'name';
    var metaElem = _.find(document.getElementsByTagName("meta"), function(element) {
      if (name == element.name || name == element.getAttribute("property")) {
        return element;
      }
    });
    if (metaElem) {
      setAttr(metaElem, attr);
    } else {
      var meta = document.createElement('meta');
      meta.setAttribute(nameType, name);
      setAttr(meta, attr);
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }

  // Standard Head Tags
  document.title = this.lookupOption('seoTitle');
  setMeta('description', 'seoDesc');
  setMeta('author', 'seoAuthor');

  // OpenGraph Head Tags
  setMeta('og:type', 'seoType', 'property');
  setMeta('og:title', 'seoTitle', 'property');
  setMeta('og:description', 'seoDesc', 'property');
  setMeta('og:image', 'seoImage', 'property');
  Tracker.autorun(function() {
    Tracker.afterFlush( function() {
      setMeta('og:url', location.href, 'property');
    })
  });

  // Twitter Head Tags
  setMeta('twitter:card', 'summary_large_image', 'property');
  setMeta('twitter:site', 'seoTwitter', 'property');
  setMeta('twitter:title', 'seoTitle');
  setMeta('twitter:description', 'seoDesc', 'property');
  setMeta('twitter:image', 'seoImage', 'property');

};

// Scroll up to the top of page after changing routes.
// (Takes into account navbar height).
// If the previous route name is the same as the current (only params changed)
// then we might not want to scroll all the way to the top. So if there's an
// element with the id `scroll-top` then we scroll up (but never down) to it.
scrollToTop = function () {
  var self = this;

  if (self.ready()) {
    Tracker.nonreactive(function () {
      var current = Router.current().route.getName();
      var prev = Session.get("prev_route_name");
      var position = 0;

      // This is the same route, only params have changed, use #scroll-top
      if (current === prev) {
        var topEl = $('#scroll-top');
        if (topEl && topEl.offset()) {
          position = topEl.offset().top - $('nav.navbar').outerHeight();
        }
      }
      if (position < $(window).scrollTop()) {
        Tracker.afterFlush(function () {
          // defer until after the DOM update to avoid flicker
          $(window).scrollTop(position);
        });
      }
      Session.set("prev_route_name", current);
    });
  }
};
