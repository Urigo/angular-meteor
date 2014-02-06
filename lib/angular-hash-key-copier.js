(function( ng ) {
	"use strict";

	// We're going to package this as its own module. Not sure how else to distribute
	// an AngularJS class since it depends on an actual application name at the code-
	// time of the class definition.
	var module = ng.module( "hashKeyCopier", [] );

	// Define the injectable. We're using "value" because the result is a construtor,
	// NOT the result of a constructor instantiation. 
	module.value( "HashKeyCopier", HashKeyCopier );

	// I am the constructor.
	function HashKeyCopier( source, destination, uniqueIdentifiers ) {

		// ---
		// INITIALIZATION.
		// ---


		// I am the key that AngularJS uses to store the expando property.
		var hashKeyPropertyName = "$$hashKey";

		// I am the index of hashKeys in the source object. This provides a pseudo-
		// location of each hashKey value based on the structure of the source object.
		var hashKeyIndex = {};

		// I am a collection of keys used to determine the identity of an object at a
		// given location within the source / destination targets. It is one of these
		// keys that will be used to determine if two objects are logically equivalent;
		// and therefore, should have the same hashKey.
		//
		// If nothing is provided, default to the most common - ID.
		if ( ! uniqueIdentifiers ) {

			uniqueIdentifiers = [ "id" ];

		}

		// I am the RegEx pattern that determins if a given string represents a proprietary
		// AngularJS name - they all being with "$". We don't need to waste our time 
		// looking at these properties when it comes to iterating over our targets.
		var angularJSPropertyPattern = /^$/i;


		// ---
		// PUBLIC METDHODS.
		// ---


		// I execute the copy operation from the source object to the destination object.
		function copyHashKeys() {	

			// If either the existing or the source objects are empty, there's nothing to
			// do - just return the destination.
			if ( isTargetEmpty( source ) || isTargetEmpty( destination ) ) {
				
				return( destination );

			}

			// Reset the hash key index for the copy operation.
			hashKeyIndex = {};

			// Build and apply the hashkey index.
			buildHashKeyIndexFromSource();
			applyHashKeyIndexToDestination();

			return( destination );

		}


		// ---
		// PRIVATE METDHODS.
		// ---


		// I apply the hashkey index to the current destination.
		function applyHashKeyIndexToDestination() {

			if ( ng.isArray( destination ) ) {

				applyHashKeyIndexToArray( "[]", destination );

			} else if ( ng.isObject( destination ) ) {

				applyHashKeyIndexToObject( ".", destination );

			}

		}


		// I apply the hashkey index to the given Array.
		function applyHashKeyIndexToArray( path, target ) {

			for ( var i = 0, length = target.length ; i < length ; i++ ) {

				var targetItem = target[ i ];

				if ( ng.isArray( targetItem ) ) {

					applyHashKeyIndexToArray( ( path + "[]" ), targetItem );

				} else if ( ng.isObject( targetItem ) ) {

					applyHashKeyIndexToObject( ( path + "." ), targetItem );

				}

			}

		}


		// I apply the hasheky index to the given Object.
		function applyHashKeyIndexToObject( path, target ) {

			var identifier = getUniqueIdentifierForObject( target );

			if ( identifier ) {

				var hashKeyPath = ( path + target[ identifier ] );

				if ( hashKeyIndex.hasOwnProperty( hashKeyPath ) ) {

					target[ hashKeyPropertyName ] = hashKeyIndex[ hashKeyPath ];

				}
				
			}

			for ( var key in target ) {

				if ( target.hasOwnProperty( key ) && isUserDefinedProperty( key ) ) {

					var targetItem = target[ key ];

					if ( ng.isArray( targetItem ) ) {

						applyHashKeyIndexToArray( ( path + key + "[]" ), targetItem );

					} else if ( ng.isObject( targetItem ) ) {

						applyHashKeyIndexToObject( ( path + key + "." ), targetItem );

					}

				}

			}

		}


		// I build the hashkey index from the current source object.
		function buildHashKeyIndexFromSource() {

			if ( ng.isArray( source ) ) {

				buildHashKeyIndexFromArray( "[]", source );

			} else if ( ng.isObject( source ) ) {

				buildHashKeyIndexFromObject( ".", source );

			}

		}


		// I build the hashkey index from the given Array.
		function buildHashKeyIndexFromArray( path, target ) {

			for ( var i = 0, length = target.length ; i < length ; i++ ) {

				var targetItem = target[ i ];

				if ( ng.isArray( targetItem ) ) {

					buildHashKeyIndexFromArray( ( path + "[]" ), targetItem );

				} else if ( ng.isObject( targetItem ) ) {

					buildHashKeyIndexFromObject( ( path + "." ), targetItem );

				}

			}

		}


		// I build the hashkey index from the given Object.
		function buildHashKeyIndexFromObject( path, target ) {

			if ( target.hasOwnProperty( hashKeyPropertyName ) ) {

				var identifier = getUniqueIdentifierForObject( target );

				if ( identifier ) {

					hashKeyIndex[ path + target[ identifier ] ] = target[ hashKeyPropertyName ];
					
				}

			}

			for ( var key in target ) {

				if ( target.hasOwnProperty( key ) && isUserDefinedProperty( key ) ) {

					var targetItem = target[ key ];

					if ( ng.isArray( targetItem ) ) {

						buildHashKeyIndexFromArray( ( path + key + "[]" ), targetItem );

					} else if ( ng.isObject( targetItem ) ) {

						buildHashKeyIndexFromObject( ( path + key + "." ) , targetItem );

					}

				}

			}

		}


		// I return the unique identifier for the given object; returns null if none of the 
		// keys match any of the defined identifiers.
		function getUniqueIdentifierForObject( target ) {

			for ( var i = 0, length = uniqueIdentifiers.length ; i < length ; i++ ) {

				var identifier = uniqueIdentifiers[ i ];

				if ( target.hasOwnProperty( identifier ) ) {

					return( identifier );

				}

			}

			return( null );

		}


		// I check to see if the given object is locigally empty.
		function isTargetEmpty( target ) {

			// If the object is a falsey, determine it as empty.
			if ( ! target ) {

				return( true );

			}

			// If the value is an array, check its length.
			if ( ng.isArray( target ) ) {

				return( target.length === 0 );

			}

			// If the value is an object, consider to to be non-empty.
			if ( ng.isObject( target ) ) {

				return( false );

			}
			
			// If the value was neither an array nor an object, consider it empty for the
			// purposes of our copy operation.
			return( true );

		}


		// I determine if the given property name is one defined by the user (or more 
		// specifically, one that is NOT defined by the AngularJS framework).
		function isUserDefinedProperty( name ) {

			return( ! angularJSPropertyPattern.test( name ) );

		}


		// ---
		// RETURN PUBLIC API.
		// ---


		return({
			copyHashKeys: copyHashKeys
		});

	}

	// I provide a "static" method that encapsulates the proper instantation and 
	// execution of the copy operation.
	HashKeyCopier.copyHashKeys = function( source, destination, uniqueIdentifiers ) {

		var copier = new HashKeyCopier( source, destination, uniqueIdentifiers );

		copier.copyHashKeys();

		return( destination );

	};

})( angular );