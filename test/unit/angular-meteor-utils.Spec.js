'use strict';

var Mongo;

describe('Given the Angular Meteor Utils Service', function() {

    var $meteorUtils;

    beforeEach(function () {

        module('angular-meteor.utils');
        // Injecting Services to use
        inject(function (_$meteorUtils_) {
            $meteorUtils = _$meteorUtils_;
        });

    });

    describe('when using GetCollectionByName(collectionName)', function() {

        beforeEach(function() {

            // Mocking a Collection
            function Collection() {}
            Collection.prototype._name = 'myCollection';
            Mongo = {Collection: Collection};
            window.myCol = new Mongo.Collection;
        });

        it('should find and return a mongo collection by name', function() {
            var output = $meteorUtils.getCollectionByName('myCollection');
            expect(output).toEqual(window.myCol);

        });

        it('should return "undefined" if it cant find the collection', function() {

            var output = $meteorUtils.getCollectionByName('myCollectionFake');
            expect(output).toEqual(undefined);

        })
    });
});