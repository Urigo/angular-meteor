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

    describe('when calling GetCollectionByName()', function() {

        beforeEach(function() {
            function Collection() {
                alert('test');
            }
            Collection.prototype._name = 'myCollection';
            Mongo = {Collection: Collection};
            window.myCol = new Mongo.Collection;
        });

        it('should return a mongo collection', function() {
            var output = $meteorUtils.getCollectionByName('myCollection');
            expect(output).toEqual(window.myCol);

        });
    });
});