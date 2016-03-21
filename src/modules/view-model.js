import _ from '../lib/underscore';
import { name as utilsName, utils } from './utils';
import { name as mixerName, Mixer } from './mixer';
import { name as coreName } from './core';

export const name = 'angular-meteor.view-model';
export const ViewModel = '$$ViewModel';
export const reactive = '$reactive';

angular.module(name, [
  utilsName,
  mixerName,
  coreName
])

/*
  A mixin which lets us bind a view model into a scope.
  Note that only a single view model can be bound,
  otherwise the scope might behave unexpectedly.
  Mainly used to define the controller as the view model,
  and very useful when wanting to use Angular's `controllerAs` syntax.
 */
.factory(ViewModel, [
  utils,
  Mixer,

  function($$utils, $Mixer) {
    function $$ViewModel() {}

    // Gets an object, wraps it with scope functions and returns it
    $$ViewModel.viewModel = function(vm) {
      if (!_.isObject(vm)) {
        throw Error('argument 1 must be an object');
      }

      // Extend view model with mixin functions
      $Mixer._extend(vm, {
        pattern: /^(?!\$\$).*$/, // Omitting methods which start with a $$ notation
        context: this // Binding methods to scope
      });

      // Apply mixin constructors on scope with view model
      $Mixer._construct(this, vm);
      return vm;
    };

    return $$ViewModel;
  }
])


/*
  Illustrates the old API where a view model is created using $reactive service
 */
.service(reactive, [
  utils,

  function($$utils) {
    class Reactive {
      constructor(vm) {
        if (!_.isObject(vm)) {
          throw Error('argument 1 must be an object');
        }

        _.defer(() => {
          if (!this._attached) {
            console.warn('view model was not attached to any scope');
          }
        });

        this._vm = vm;
      }

      attach(scope) {
        this._attached = true;

        if (!$$utils.isScope(scope)) {
          throw Error('argument 1 must be a scope');
        }

        const viewModel = scope.viewModel(this._vm);

        // Similar to the old/Meteor API
        viewModel.call = viewModel.callMethod;
        viewModel.apply = viewModel.applyMethod;

        return viewModel;
      }
    }

    return (vm) => new Reactive(vm);
  }
]);
