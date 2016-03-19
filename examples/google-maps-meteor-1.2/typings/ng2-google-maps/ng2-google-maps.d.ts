/// <reference path="angular2.d.ts" />

declare module mapTypes {
    export var google: any;

    export interface GoogleMap {
        constructor(el: HTMLElement, opts?: MapOptions): void;
        panTo(latLng: LatLng | LatLngLiteral): void;
        setZoom(zoom: number): void;
        addListener(eventName: string, fn: Function): void;
        getCenter(): LatLng;
        setCenter(latLng: LatLng | LatLngLiteral): void;
        getZoom(): number;
        setOptions(options: MapOptions): void;
    }

    export interface LatLng {
        constructor(lat: number, lng: number): void;
        lat(): number;
        lng(): number;
    }

    export interface Marker {
        constructor(options?: MarkerOptions): void;
        setMap(map: GoogleMap): void;
        setPosition(latLng: LatLng | LatLngLiteral): void;
        setTitle(title: string): void;
        setLabel(label: string | MarkerLabel): void;
        getLabel(): MarkerLabel;
        addListener(eventType: string, fn: Function): void;
    }

    export interface MarkerOptions {
        position: LatLng | LatLngLiteral;
        title?: string;
        map?: GoogleMap;
        label?: string | MarkerLabel;
    }

    export interface MarkerLabel {
        color: string;
        fontFamily: string;
        fontSize: string;
        fontWeight: string;
        text: string;
    }

    export interface LatLngLiteral {
        lat: number;
        lng: number;
    }

    export interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
        disableDoubleClickZoom?: boolean;
    }
}

declare module 'ng2-google-maps/core' {
	export abstract class MapsAPILoader {
	    abstract load(): Promise<void>;
	}

	export enum GoogleMapsScriptProtocol {
	    HTTP = 0,
	    HTTPS = 1,
	    AUTO = 2,
	}

	export class LazyMapsAPILoaderConfig {
	    apiKey: string;
	    apiVersion: string;
	    hostAndPath: string;
	    protocol: GoogleMapsScriptProtocol;
	}

	export class LazyMapsAPILoader extends MapsAPILoader {
	    private _config;
	    private _scriptLoadingPromise;
	    constructor(_config: LazyMapsAPILoaderConfig);
	    load(): Promise<void>;
	    private _getScriptSrc(callbackName);
	}

  import { NgZone } from 'angular2/core';
	/**
	 * Wrapper class that handles the communication with the Google Maps Javascript
	 * API v3
	 */
	export class GoogleMapsAPIWrapper {
	    private _loader;
	    private _zone;
	    private _map;
	    private _mapResolver;
	    constructor(_loader: MapsAPILoader, _zone: NgZone);
	    createMap(el: HTMLElement, mapOptions: mapTypes.MapOptions): Promise<void>;
	    setMapOptions(options: mapTypes.MapOptions): void;
	    /**
	     * Creates a google map marker with the map context
	     */
	    createMarker(options?: mapTypes.MarkerOptions): Promise<mapTypes.Marker>;
	    subscribeToMapEvent<E>(eventName: string): Observable<E>;
	    setCenter(latLng: mapTypes.LatLngLiteral): Promise<void>;
	    getZoom(): Promise<number>;
	    setZoom(zoom: number): Promise<void>;
	    getCenter(): Promise<mapTypes.LatLng>;
	}

	import { SimpleChange, OnDestroy, OnChanges, EventEmitter } from 'angular2/core';
	export class SebmGoogleMapMarker implements OnDestroy, OnChanges {
	    private _markerManager;
	    latitude: number;
	    longitude: number;
	    title: string;
	    label: string;
	    markerClick: EventEmitter<void>;
	    private _markerAddedToManger;
	    private _id;
	    constructor(_markerManager: MarkerManager);
	    ngOnChanges(changes: {
	        [key: string]: SimpleChange;
	    }): void;
	    id(): string;
	    toString(): string;
	    ngOnDestroy(): void;
	}


	import { Observable } from 'rxjs/Observable';
	export class MarkerManager {
	    private _mapsWrapper;
	    private _markers;
	    constructor(_mapsWrapper: GoogleMapsAPIWrapper);
	    deleteMarker(marker: SebmGoogleMapMarker): Promise<void>;
	    updateMarkerPosition(marker: SebmGoogleMapMarker): Promise<void>;
	    updateTitle(marker: SebmGoogleMapMarker): Promise<void>;
	    updateLabel(marker: SebmGoogleMapMarker): Promise<void>;
	    addMarker(marker: SebmGoogleMapMarker): void;
	    createClickObserable(marker: SebmGoogleMapMarker): Observable<void>;
	}

	import { Renderer, ElementRef } from 'angular2/core';
	/**
	 * Todo: add docs
	 */
	export class SebmGoogleMap implements OnChanges {
	    private _longitude;
	    private _latitude;
	    private _zoom;
	    disableDoubleClickZoom: boolean;
	    private static _mapOptionsAttributes;
	    mapClick: EventEmitter<MapMouseEvent>;
	    mapRightClick: EventEmitter<MapMouseEvent>;
	    mapDblClick: EventEmitter<MapMouseEvent>;
	    private _mapsWrapper;
	    constructor(elem: ElementRef, _mapsWrapper: GoogleMapsAPIWrapper, renderer: Renderer);
	    private _initMapInstance(el);
	    private static _containsMapOptionsChange(changesKeys);
	    ngOnChanges(changes: {
	        [propName: string]: SimpleChange;
	    }): void;
	    _setMapOptions(): void;
	    zoom: number | string;
	    longitude: number | string;
	    latitude: number | string;
	    private _convertToDecimal(value);
	    private _updateCenter();
	    private _handleMapCenterChange();
	    private _handleMapZoomChange();
	    private _handleMapMouseEvents();
	}

	/**
	 * MapMouseEvent gets emitted when the user triggers mouse events on the map.
	 */
	export interface MapMouseEvent {
	    coords: mapTypes.LatLngLiteral;
	}

	export const ANGULAR2_GOOGLE_MAPS_DIRECTIVES: any[];

	/**
	 * When using the NoOpMapsAPILoader, the Google Maps API must be added to the page via a `<script>`
	 * Tag.
	 * It's important that the Google Maps API script gets loaded first on the page.
	 */
	export class NoOpMapsAPILoader implements MapsAPILoader {
	    load(): Promise<void>;
	}

	export const ANGULAR2_GOOGLE_MAPS_PROVIDERS: any[];
}
