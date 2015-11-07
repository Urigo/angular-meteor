moment = module.exports;
module = undefined;
define = function (mtz, mom, onload) {
  onload(moment);
};
define.amd = true;
