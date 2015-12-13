# accounts-ui packaged for Angular 2
Package contains one Angular 2 component-wrapper exported via "meteor-accounts-ui" System.js module.

This component simply wraps around "accounts-ui" package's _loginButtons_ view and recognizes one "align" attribute for the same name property of the _loginButtons_ view. For more information about "accounts-ui", please read original [docs](https://atmospherejs.com/meteor/accounts-ui).

Component import line:

    import {AccountUI} from 'meteor-accounts-ui'
  
Directive usage line:
  
    <accounts-ui></accounts-ui>
