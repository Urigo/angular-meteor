import _ from 'underscore';

if (typeof _ === 'undefined') {
  if (typeof Package.underscore === 'undefined') {
    throw new Error('underscore is missing');
  }
}

export default _ || Package.underscore._;
