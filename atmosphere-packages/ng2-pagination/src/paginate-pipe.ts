/// <reference path="../../../typings/angular2.d.ts" />

'use strict';

import {Pipe} from 'angular2/core';

import {PaginationService} from './pagination-service';

import {IPaginationInstance} from './pagination-service';

@Pipe({
  name: 'paginate',
  pure: false
})
export class PaginatePipe {
  private _pagination: IPaginationInstance;

  constructor(private service: PaginationService) {}

  public transform(collection: any, args: any[]): any {
    let pagination = this._createFromConfig(collection, args);
    if (!this._pagination) {
      this._pagination = pagination;
      this.service.register(this._pagination);
    } else {
      /** 
       * Update itemsPerPage and/or totalItems.
       * currentPage is not allowed to be changed in the config,
       * it can be set only via service API itself.
       */
      let itemsPerPage = pagination.itemsPerPage;
      let totalItems = pagination.totalItems;
      this.service.update(this._pagination.id, { itemsPerPage, totalItems });
    }

    if (collection instanceof Array) {
      let itemsPerPage = this.service.getItemsPerPage(this._pagination.id);
      let start = (this.service.getCurrentPage(this._pagination.id) - 1) * itemsPerPage;
      let end = start + itemsPerPage;
      return collection.slice(start, end);
    }

    return collection;
  }

  private _createFromConfig(collection: any, args: any): IPaginationInstance {
    let instance: IPaginationInstance;
    let config = args[0];

    if (_.isString(config) || _.isNumber(config)) {
      instance = {
        id: this.service.defaultId,
        itemsPerPage: this._parseValue(config, 1),
        currentPage: 1,
        totalItems: this._parseTotalItems(collection)
      };
    }

    if (_.isObject(config)) {
      instance = {
        id: config.id || this.service.defaultId,
        itemsPerPage: this._parseValue(config.itemsPerPage, 10),
        currentPage: this._parseValue(config.currentPage, 1),
        totalItems: this._parseTotalItems(collection, config.totalItems)
      };
    }

    if (!instance) {
      throw new Error(`PaginatePipe: Argument must be a string,
        number or an object. Got ${typeof args[0]}`);
    }

    return instance;
  }

  private _parseTotalItems(collection: any,
                           totalItems?: string | number): number {
    if (!_.isUndefined(totalItems)) {
      return this._parseValue(totalItems);
    }

    if (collection instanceof Array) {
      return collection.length;
    }

    return undefined;
  }

  private _parseValue(value: string | number, dfault?: number): number {
    if (!_.isUndefined(value)) {
      let parsed = parseInt(<string>value);
      if (_.isNumber(parsed)) {
        return parsed;
      }
    }

    return dfault;
  }
}
