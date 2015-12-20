/// <reference path="../../../typings/angular2.d.ts" />

'use strict';

import {EventEmitter} from 'angular2/core';

export interface IPaginationInstance {
  /**
   * An optional ID for the pagination instance. Only useful if you wish to
   * have more than once instance at a time in a given component.
   */
  id?: string;

  /**
   * The number of items per paginated page.
   */
  itemsPerPage: number;

  /**
   * The current (active) page.
   */
  currentPage: number;

  /**
   * The total number of items in the collection. Only useful when
   * doing server-side paging, where the collection size is limited
   * to a single page returned by the server API.
   *
   * For in-memory paging, this property should not be set, as it
   * will be automatically set to the value of collection.length.
   */
  totalItems?: number;
}

const DEFAULT_ID = 'ng2_pages';

export class PaginationService {
  public change: EventEmitter<string> = new EventEmitter();

  private instances: { [id: string]: IPaginationInstance } = {};

  get defaultId() { return DEFAULT_ID }

  public register(instance: IPaginationInstance) {
    if (!instance.id) {
      instance.id = DEFAULT_ID;
    }

    this._checkNumberArg(instance.itemsPerPage,
      'pagination.itemsPerPage', 'register');
    this._checkNumberArg(instance.totalItems,
      'pagination.totalItems', 'register');
    this._checkNumberArg(instance.currentPage,
      'pagination.currentPage', 'register');

    this.instances[instance.id] = instance;
    this.change.emit(instance.id);
  }

  public update(id: string, { itemsPerPage, totalItems }:
                            { itemsPerPage: number, totalItems: number }) {
    this._checkPagination(id, 'update');
    this._checkNumberArg(itemsPerPage, 'itemsPerPage', 'update', true);
    this._checkNumberArg(totalItems, 'totalItems', 'update', true);

    let instance = this.instances[id];
    let isModified = false;

    if (instance.itemsPerPage != itemsPerPage) {
      this._setItemsPerPage(id, itemsPerPage);
      isModified = true;
    }

    if (instance.totalItems != totalItems) {
      this._setTotalItems(id, totalItems);
      isModified = true;
    }

    if (isModified) {
      this.change.emit(id);
    }
  }

  /**
   * Returns the current page number.
   */
  public getCurrentPage(id: string): number {
    if (this.instances[id]) {
      return this.instances[id].currentPage;
    }
  }

  public getItemsPerPage(id: string): number {
    if (this.instances[id]) {
      return this.instances[id].itemsPerPage;
    }
  }

  public getTotalItems(id: string): number {
    if (this.instances[id]) {
      return this.instances[id].totalItems;
    }
  }

  /**
   * Sets the current page number.
   */
  public setCurrentPage(id: string, page: number) {
    if (this.instances[id]) {
      let instance = this.instances[id];
      let maxPage = Math.ceil(instance.totalItems / instance.itemsPerPage);
      let curPage = instance.currentPage;
      if (page <= maxPage && 1 <= page && curPage !== page) {
        instance.currentPage = page;
        this.change.emit(id);
        return true;
      }
    }
    return false;
  }

  /**
   * Sets the value of instance.totalItems
   */
  public setTotalItems(id: string, totalItems: number) {
    this._checkPagination(id, 'setItemsPerPage');
    this._checkNumberArg(totalItems, 'totalItems', 'setTotalItems');

    this._setTotalItems(id, totalItems);
    this.change.emit(id);
  }

  private _setTotalItems(id: string, totalItems: number) {
    const instance = this.instances[id];
    let maxPage = Math.ceil(totalItems / instance.itemsPerPage);
    let realCurPage = Math.min(instance.currentPage, maxPage) || 1;
    instance.currentPage = realCurPage;
    instance.totalItems = totalItems;
  }

  /**
   * Sets the value of instance.itemsPerPage.
   */
  public setItemsPerPage(id: string, itemsPerPage: number) {
    this._checkPagination(id, 'setItemsPerPage');
    this._checkNumberArg(itemsPerPage, 'itemsPerPage', 'setItemsPerPage');

    this._setItemsPerPage(id, itemsPerPage);
    this.change.emit(id);
  }

  private _setItemsPerPage(id: string, itemsPerPage: number) {
    this.instances[id].itemsPerPage = itemsPerPage;
  }

  /**
   * Returns a clone of the pagination instance object matching the id. If no
   * id specified, returns the instance corresponding to the default id.
   */
  public getInstance(id: string = DEFAULT_ID): IPaginationInstance {
    if (this.instances[id]) {
      return _.clone(this.instances[id]);
    }
  }

  _checkPagination(id: string, method: string) {
    if (!this.instances[id]) {
      throw new Error(`PaginationService[${method}]:
        pagination with provided ID ${id} no found`);
    }
  }

  _checkNumberArg(value: number, arg: string, method: string, allowUndef?: boolean) {
    if (allowUndef && !_.isUndefined(value)) {
      return;
    }

    if (!_.isNumber(value) || value < 0) {
      throw new Error(`PaginationService[${method}]:
        ${arg} should be a positive number: ${value}`);
    }
  }
}
