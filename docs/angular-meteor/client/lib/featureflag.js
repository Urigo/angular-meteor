// enabled('flagName') is true if 'flagName' is enabled for this
// browser. (There is no security here. The user can enable whatever
// flags they want just by typing enable('foo') in the console. This
// is considered a feature, at least for now.) Reactive.
enabled = function (flag) {
  if (! _.has(currentFlags, flag))
    currentFlags[flag] = {
      value: false,
      dep: new Deps.Dependency
    };

  currentFlags[flag].dep.depend();
  return currentFlags[flag].value;
};

// enable('flagName') enables feature flag 'flagName' for this
// browser. This is stored in localstorage, so it is specific to a
// browser, not to a user.
enable = function (flag) {
  var flags = readFlags();
  flags[flag] = true;
  writeFlags(flags);
};

// disable('flagName') reverses enable('flagName').
disable = function (flag) {
  var flags = readFlags();
  delete flags[flag];
  writeFlags(flags);
};

// --- Implementation ---

var readFlags = function () {
  var raw = Meteor._localStorage.getItem("featureFlags") || '{}';
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.log("Couldn't parse featureFlags in localstorage. Clearing.");
    return {};
  }
};

var writeFlags = function (flags) {
  Meteor._localStorage.setItem("featureFlags", JSON.stringify(flags));
  syncFlags();
};

// Map from flag name to:
// - value: the current value of the flag (last value known from localStorage)
// - dep: Deps.Dependency
//
// Present in the map are (1) any flag that's ever been set in
// localStorage; (2) any flag that the app has ever asked about (with
// enabled()).
var currentFlags = {};

var syncFlags = function () {
  var flags = readFlags();

  _.each(_.union(_.keys(currentFlags), _.keys(flags)), function (flag) {
    var newValue = flags[flag] || false;
    if (! _.has(currentFlags, flag)) {
      currentFlags[flag] = {
        value: newValue,
        dep: new Deps.Dependency
      }
    } else if (newValue !== currentFlags[flag].value) {
      currentFlags[flag].value = newValue;
      currentFlags[flag].dep.changed();
    }
  });
};
syncFlags();

UI.registerHelper('featureFlag', function (flag) {
  return enabled(flag);
});
