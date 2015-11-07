// 'then' is a moment object (in America/Los_Angeles)
// Returns a string like:
//   'just now'
//   '2 minutes ago'
//   '1 hour ago'
//   'yesterday'
//   'last Tuesday'
//   'September 4'
//   'September 4, 2010'
// .. and updates it reactively.
// XXX before moving into a library:
//  - needs to be more efficient (if there are 1000 dates on the screen)
//    - use O(1) timers (by bucketing the wakeups somehow?)
//    - get the wakeup times exactly right (why not?)
//  - needs tests
//  - get the strings out of the locale if at all possible??
relativeDate = function (then) {
  var result, expires;

  // moment.js is pretty slow, so we avoid it where we can
  var jsNow = new Date();
  var secondsAgo = Math.floor((jsNow.getTime() - then.valueOf()) / 1000);
  var minutesAgo = Math.floor(secondsAgo / 60);
  var hoursAgo = Math.floor(minutesAgo / 60);
  var daysAgo = Math.floor(hoursAgo / 24);

  if (minutesAgo < 1) { // including times in the future
    result = "just now";
    expires = 1000;
  } else if (!hoursAgo) {
    result = minutesAgo + " minute" + (minutesAgo !== 1 ? "s" : "") + " ago";
    expires = 15 * 1000;
  } else if (!daysAgo) {
    result = hoursAgo + " hour" + (hoursAgo !== 1 ? "s" : "") + " ago";
    expires = 60 * 1000;
  } else if (daysAgo === 1) {
    result = "yesterday";
    expires = _msUntilTomorrow(then);
  } else if (daysAgo < 7) {
    result = then.format('dddd');  // eg "Sunday"
    expires = _msUntilTomorrow(then);
  } else {
    // "January 1" or "January 1, 1983"

    // Approximate the year logic for speed (we're fuzzy about timezones)
    if (then.year() === jsNow.getUTCFullYear()) {
      result = then.format('MMMM D');
    } else {
      result = then.format('MMMM D, YYYY');
    }

    // daysAgo > 7, and, like sand through the hourglass, it always will be
    // => don't expire
    // (This does mean that we won't change the format if we roll over a year)
    //expires = msUntilTomorrow;
  }

  if (Deps.active && expires) {
    var computation = Deps.currentComputation;
    var timer = setTimeout(function () {
      computation.invalidate();
    }, expires);
    computation.onInvalidate(function () {
      clearTimeout(timer);
    });
  }

  return result;
};

var _msUntilTomorrow = function (then) {
  var now = moment().tz(Artia.timezone);
  var startOfTomorrow = now.clone().startOf('day').add('day', 1);
  return startOfTomorrow.diff(now);
};

briefDate = function (post) {
  var localMoment = post.localMoment();
  return localMoment && localMoment.format('DD.MM.YY');
};

prettyDate = function (post) {
  var capitalize = function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  return capitalize(relativeDate(post.localMoment()));
};
