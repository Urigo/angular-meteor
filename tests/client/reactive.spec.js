import 'angular-meteor';

import jsondiffpatch from 'jsondiffpatch';
import {chai} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:sinon';

const expect = chai.expect;

import {DummyCollection} from '../collections';

describe('angular-meteor.reactive', function() {
  beforeEach(angular.mock.module('angular-meteor'));

  var $rootScope;

  beforeEach(angular.mock.inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
  }));

  it('should not depend outside of computation', function() {
    DummyCollection.remove({});

    scope = $rootScope.$new();
    vm = scope.viewModel({});

    var c = vm.autorun(function() {
    });

    vm.helpers({
      parties: function() {
        return DummyCollection.find({});
      }
    });

    scope.$watch("$$vm.parties", function() {});

    c.invalidate();

    Tracker.flush();

    expect(vm.$$dependencies.parties._dependentsById[c._id]).to.be.undefined;
  });

  describe('$$Reactive', function() {
    afterEach(function() {
      DummyCollection.remove({});
    });

    it('should extend child scope', function() {
      var scope = $rootScope.$new();
      expect(scope.helpers).to.be.a('function');
      expect(scope.getReactively).to.be.a('function');
      expect(scope.getCollectionReactively).to.be.a('function');
    });

    describe('helpers()', function() {
      var scope;
      var vm;

      beforeEach(function() {
        scope = $rootScope.$new();
        vm = scope.viewModel({});
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should register a number helper', function () {
        vm.helpers({
          helper: function () {
            return 10;
          }
        });

        expect(vm.helper).to.equal(10);
      });

      it('should register a string helper', function () {
        vm.helpers({
          helper: function () {
            return 'str';
          }
        });

        expect(vm.helper).to.equal('str');
      });

      it('should register an object helper', function () {
        var obj = {
          foo: 'foo',
          bar: 'bar'
        };

        vm.helpers({
          helper: function () {
            return obj;
          }
        });

        expect(vm.helper).to.equal(obj);
      });

      it('should register an array helper', function () {
        var arr = [1, 2, 3];

        vm.helpers({
          helper: function () {
            return arr;
          }
        });

        expect(vm.helper).to.equal(arr);
      });

      it('should override a pre-defined helper', function () {
        vm.helper = 'foo';

        vm.helpers({
          helper: function () {
            return 'bar';
          }
        });

        expect(vm.helper).to.equal('bar');
      });

      it('should register cursor helper as an array', function () {
        vm.helpers({
          helper: function () {
            return DummyCollection.find();
          }
        });

        expect(vm.helper).to.be.an('array');
      });

      it('should update cursor helper as collection gets updated', function () {
        var cursor = DummyCollection.find();

        vm.helpers({
          helper: function () {
            return cursor;
          }
        });

        DummyCollection.insert({
          _id: 'my-doc'
        });

        expect(vm.helper).to.be.an('array');
        expect(vm.helper.length).to.equal(1);

        DummyCollection.remove({_id: 'my-doc'});
        expect(vm.helper).to.be.an('array');
        expect(vm.helper.length).to.equal(0);
      });

      it('should register fetch result helper as an array', function () {
        vm.helpers({
          helper: function () {
            return DummyCollection.find().fetch();
          }
        });

        expect(vm.helper).to.be.an('array');
      });

      it('should update cursor helper once a new document is added', function () {
        vm.helpers({
          helper: function () {
            return DummyCollection.find();
          }
        });

        var doc = { _id: 'my-doc' };
        DummyCollection.insert(doc);
        expect(vm.helper.length).to.equal(1);
        expect(vm.helper[0]).to.deep.equal(doc);
      });

      it('should update cursor helper once a document is removed', function () {
        var doc = { _id: 'my-doc' };
        DummyCollection.insert(doc);

        vm.helpers({
          helper: function () {
            return DummyCollection.find();
          }
        });

        DummyCollection.remove(doc);
        expect(vm.helper.length).to.equal(0);
      });

      it('should update cursor helper once a document is updated', function () {
        vm.helpers({
          helper: function () {
            return DummyCollection.find();
          }
        });

        var doc = {
          _id: 'my-doc',
          prop: 'foo'
        };

        DummyCollection.insert(doc);
        DummyCollection.update({ _id: 'my-doc' }, { $set: { prop: 'bar' } });

        expect(vm.helper.length).to.equal(1);
        expect(vm.helper[0]).to.be.ok;
        expect(vm.helper[0].prop).to.equal('bar');
      });

      it('should update cursor helper in the right order', function () {
        vm.helpers({
          helper: function () {
            return DummyCollection.find({}, { sort: { prop: 1 } });
          }
        });

        DummyCollection.insert({
          _id: 'my-doc#1',
          prop: 'B'
        });

        expect(vm.helper.length).to.equal(1);
        expect(vm.helper[0]).to.be.ok;
        expect(vm.helper[0].prop).to.equal('B');

        DummyCollection.insert({
          _id: 'my-doc#2',
          prop: 'A'
        });

        expect(vm.helper.length).to.equal(2);
        expect(vm.helper[0]).to.be.ok;
        expect(vm.helper[1]).to.be.ok;
        expect(vm.helper[0].prop).to.equal('A');
        expect(vm.helper[1].prop).to.equal('B');
      });

      it('should digest once collection is updated', function () {
        var digest = sinon.spy(scope, '$digest');

        vm.helpers({
          helper: function () {
            return DummyCollection.find({});
          }
        });

        DummyCollection.insert({});
        expect(digest.called).to.be.true;
        digest.restore();
      });

      it('should use view model as context for helpers', function() {
        vm.helpers({
          helper: function() {
            return this;
          }
        });

        expect(vm.helper).to.equal(vm);
      });

      it('should NOT trigger autorun dependencies when using object and adding a sub property', function () {
        var calls = 0;

        vm.prop = {
          subProp: 10
        };

        vm.helpers({
          helper: function () {
            calls++;
            return vm.getReactively('prop');
          }
        });

        scope.$$throttledDigest();
        Tracker.flush();

        expect(calls).to.equal(1);
        vm.prop.newSubProp = 20;

        scope.$$throttledDigest();
        Tracker.flush();

        expect(calls).to.equal(1);
      });

      it('should trigger autorun dependencies when using object and adding a sub property while watching deep', function () {
        var calls = 0;

        vm.prop = {
          subProp: 10
        };

        vm.helpers({
          helper: function () {
            calls++;
            return vm.getReactively('prop', true);
          }
        });

        scope.$$throttledDigest();
        Tracker.flush();

        expect(calls).to.equal(1);
        vm.prop.newSubProp = 20;

        scope.$$throttledDigest();
        Tracker.flush();

        expect(calls).to.equal(2);
      });

      it('should NOT reactivate cursors', function() {
        expect(scope.$$watchersCount).to.equal(0);

        vm.helpers({
          helper: function() {
            return DummyCollection.find({});
          }
        });

        expect(scope.$$watchersCount).to.equal(0);
      });

      it('should NOT trigger autorun dependencies when using array and adding an element sub property while watching as a collection', function () {
        var callCount = 0;

        vm.prop = [{
          mySubProp: 10
        }];

        vm.helpers({
          myMethod: function () {
            callCount++;
            return vm.getCollectionReactively('prop');
          }
        });

        scope.$apply();
        Tracker.flush();
        expect(callCount).to.equal(1);

        vm.prop[0].newProp = 20;
        scope.$apply();
        Tracker.flush();

        expect(callCount).to.equal(1);
      });

      it('should trigger autorun dependencies when using array and replacing an element while watching as a collection', function () {
        var callCount = 0;

        vm.prop = [10];

        vm.helpers({
          myMethod: function () {
            callCount++;
            return vm.getCollectionReactively('prop');
          }
        });

        scope.$apply();
        Tracker.flush();
        expect(callCount).to.equal(1);

        vm.prop[0] = 20;
        scope.$apply();
        Tracker.flush();

        expect(callCount).to.equal(2);
      });

      it('should trigger autorun dependencies when using array and adding an element while watching as a collection', function () {
        var callCount = 0;

        vm.prop = [10];

        vm.helpers({
          myMethod: function () {
            callCount++;
            return vm.getCollectionReactively('prop');
          }
        });

        scope.$apply();
        Tracker.flush();
        expect(callCount).to.equal(1);

        vm.prop.push(20);
        scope.$apply();
        Tracker.flush();

        expect(callCount).to.equal(2);
      });

      it('should NOT invoke the reactive function when internal observation updates', function () {
        let callCount = 0;
        vm.helpers({
          parties() {
            callCount++;
            return DummyCollection.find({});
          }
        });

        scope.$apply();
        Tracker.flush();

        DummyCollection.insert({
          name: 'foo'
        });

        scope.$apply();
        Tracker.flush();

        expect(callCount).to.equal(1);
        expect(vm.parties.length).to.equal(1);
      });

      it('should be able to register view model and scope helpers at the same time', function() {
        scope.helpers({
          parties() { return DummyCollection.find({}); }
        });

        vm.helpers({
          meetings() { return DummyCollection.find({}); }
        });

        expect(scope.parties).to.be.ok;
        expect(vm.parties).to.be.undefined;
        expect(vm.meetings).to.be.ok;
        expect(scope.meetings).to.be.undefined;
      });

      it('should register helpers on the specified context', function() {
        scope.helpers(vm, {
          parties() { return DummyCollection.find({}); }
        });

        expect(vm.parties).to.be.ok;
        expect(scope.parties).to.be.undefined;
      });

      describe('should compare data between cursors', function() {
        let calls;
        const jsondiffpatchCopy = _.clone(jsondiffpatch);

        beforeEach(() => {
          DummyCollection.insert({
            type: 1,
            name: 'foo'
          });
          DummyCollection.insert({
            type: 1,
            name: 'bar'
          });
          DummyCollection.insert({
            type: 2,
            name: 'baz'
          });

          // because of jasmine keeps an arguments as a references
          // instead of a copies and jsondiffpatch.patch changes first argument
          // which is lastModelData
          // we cannot check first argument's value of jsondiffpatch.diff
          // so we have to use some sort of wrapper
          // Instead of tracking whole arrays we can just track their lengths
          calls = {
            diff: [],
            patch: []
          };

          sinon.stub(jsondiffpatch, 'diff', (lastModelData, modelData) => {
            // save lengths of arguments
            calls.diff.push([
              lastModelData.length,
              modelData.length
            ]);
            return jsondiffpatchCopy.diff(lastModelData, modelData);
          });
          sinon.stub(jsondiffpatch, 'patch', (lastModelData, diff) => {
            // save length of only first argument
            calls.patch.push(lastModelData.length);
            return jsondiffpatchCopy.patch(lastModelData, diff);
          });

          vm.type = 1;
          vm.helpers({
            parties() {
              return DummyCollection.find({
                type: vm.getReactively('type')
              });
            }
          });

          scope.$apply();
          Tracker.flush();
        });

        afterEach(() => {
          jsondiffpatch.patch.restore();
          jsondiffpatch.diff.restore();
        });

        it('should not compare on initial data', function() {
          expect(jsondiffpatch.patch.calledOnce).to.be.false;
          expect(jsondiffpatch.diff.calledOnce).to.be.false;
          // also check actual result:
          // 2 docs with type:1
          expect(vm.parties.length).to.equal(2);
        });

        it('should compare old data with new data on cursor change', function() {
          vm.type = 2;
          scope.$apply();
          Tracker.flush();

          expect(calls.diff[0][0]).to.equal(2);
          expect(calls.diff[0][1]).to.equal(1);
          expect(calls.patch[0]).to.equal(2);
          // also check actual result:
          // 1 doc with type:2
          expect(vm.parties.length).to.equal(1);
        });
      });
    });

    describe('getReactively()', function() {
      var scope;
      var vm;

      beforeEach(function() {
        scope = $rootScope.$new();
        vm = scope.viewModel({});
      });

      afterEach(function() {
        scope.$destroy();
        if (Tracker.Dependency.restore)
          Tracker.Dependency.restore();
      });

      it('should return model', function() {
        vm.myProp = 10;
        expect(vm.getReactively('myProp')).to.equal(10);
      });

      it('should register a scope watcher', function() {
        vm.myProp = 'myProp';
        var watch = sinon.spy(scope, '$watch');

        vm.getReactively('myProp');
        expect(watch.calledWith(sinon.match.func, sinon.match.func, false)).to.be.true;

        expect(watch.args[0][0]()).to.equal('myProp');
        watch.restore();
      });

      it('should register a scope watcher with deep equality', function() {
        vm.myProp = 'myProp';
        var watch = sinon.spy(scope, '$watch');

        vm.getReactively('myProp', true);
        expect(watch.calledWith(sinon.match.func, sinon.match.func, true)).to.be.true;

        expect(watch.args[0][0]()).to.equal('myProp');
        watch.restore();
      });

      it('should register a scope watcher with shallow equality', function() {
        vm.myProp = 'myProp';
        var watch = sinon.spy(scope, '$watch');

        vm.getReactively('myProp', false);
        expect(watch.calledWith(sinon.match.func, sinon.match.func, false)).to.be.true;

        expect(watch.args[0][0]()).to.equal('myProp');
      });

      it('should register a tracker dependency', function() {
        vm.myProp = 10;

        vm.getReactively('myProp');
        expect(vm.$$dependencies).to.be.ok;
        expect(vm.$$dependencies.myProp).to.be.ok;
      });

      it('should create a dependency object for the reactive property', function() {
        vm.myProp = 10;

        var depCtorSpy = sinon.stub(Tracker, 'Dependency', function() {
          return {
            depend: angular.noop,
            changed: angular.noop
          };
        });

        vm.getReactively('myProp');
        expect(depCtorSpy.calledOnce).to.be.true;
      });

      it('should trigger the dependency logic when the watch callback is called', function() {
        vm.myProp = 10;
        var changedSpy = sinon.spy();

        sinon.stub(Tracker, 'Dependency', function() {
          return {
            depend: angular.noop,
            changed: changedSpy
          };
        });

        vm.getReactively('myProp');
        scope.$$throttledDigest();

        vm.myProp = 20;
        scope.$$throttledDigest();

        expect(changedSpy.called).to.be.true;
      });

      it('should be able to get properties reactively of both view model and scope at the same time', function() {
        var actualValue;
        scope.myProp = 'initial';

        vm.autorun(() => {
          actualValue = scope.getReactively('myProp');
        });

        expect(actualValue).to.equal('initial');

        scope.myProp = 'changed';
        scope.$$throttledDigest();
        Tracker.flush();

        expect(actualValue).to.equal('changed');
      });

      it('should get properties reactively from a specified context', function() {
        var actualValue;
        vm.myProp = 'initial';

        vm.autorun(() => {
          actualValue = scope.getReactively(vm, 'myProp');
        });

        expect(actualValue).to.equal('initial');

        vm.myProp = 'changed';
        scope.$$throttledDigest();
        Tracker.flush();

        expect(actualValue).to.equal('changed');
      });
    });

    describe('getCollectionReactively()', function() {
      var scope;
      var vm;

      beforeEach(function() {
        scope = $rootScope.$new();
        vm = scope.viewModel({});
      });

      afterEach(function() {
        scope.$destroy();
      });

      it('should return model', function() {
        vm.myProp = 10;
        expect(vm.getCollectionReactively('myProp')).to.equal(10);
      });

      it ('should register a scope collection watcher', function() {
        vm.myProp = 'myProp';
        var watchSpy = sinon.spy(scope, '$watchCollection');

        vm.getCollectionReactively('myProp', false);
        expect(watchSpy.calledWith(sinon.match.func, sinon.match.func)).to.be.true;

        expect(watchSpy.args[0][0]()).to.equal('myProp');
      });
    });
  });
});
