/// <reference path="../../../typings/angular2.d.ts" />

'use strict';

import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {Subscription} from 'rxjs/Rx';

import {PaginationService} from "./pagination-service";

export interface IPage {
  label: string;
  value: any;
}

@Component({
    selector: 'pagination-controls',
    templateUrl: '/packages/barbatus_ng2-pagination/src/pagination-controls-cmp.html'
})
export class PaginationControlsCpm {
  @Input() private _id: string;

  @Output() public change: EventEmitter<number> = new EventEmitter();

  protected pages: IPage[] = [];

  private _page: number = 1;

  private _changeSub: Subscription<string>;

  constructor(private _service: PaginationService) {
    this._id = this._id || this._service.defaultId;

    this._changeSub = this._service.change
      .subscribe(id => {
        if (this._id !== id) return;

        let instance = this._service.getInstance(this._id);
        this.pages = this._createPageArray(instance.currentPage,
          instance.itemsPerPage, instance.totalItems);
        this._setPage(instance.currentPage);
      });
  }

  private ngOnDestroy() {
    this._changeSub.unsubscribe();
  }

  /**
   * Set the current page number.
   */
  public setPage(event, page: number) {
    event.preventDefault();

    this._service.setCurrentPage(this._id, page);
  }

  /**
   * Get the current page number.
   */
  public getPage(): number {
    return this._service.getCurrentPage(this._id);
  }

  public _setPage(page) {
    if (this._page !== page) {
      this._page = page;
      this.change.emit({ page });
    }
  }

  /**
   * Returns an array of IPage objects to use in the pagination controls.
   */
  private _createPageArray(currentPage: number, itemsPerPage: number,
                           totalItems: number, paginationRange: number = 5): IPage[] {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const halfWay = Math.ceil(paginationRange / 2);

    const isStart = currentPage <= halfWay;
    const isEnd = totalPages - halfWay < currentPage;
    const isMiddle = !isStart && !isEnd;
    const ellipsesNeeded = paginationRange < totalPages;

    let pages = [];
    let page = 1;
    while (page <= totalPages && page <= paginationRange) {
      let pageNumber = this.calculatePageNumber(page, currentPage, paginationRange, totalPages);
      let openingEllipsesNeeded = (page === 2 && (isMiddle || isEnd));
      let closingEllipsesNeeded = (page === paginationRange - 1 && (isMiddle || isStart));

      let label = pageNumber.toString();
      if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
        label = '...';
      }
      pages.push({
        label: label,
        value: pageNumber
      });

      page++;
    }

    return pages;
  }

  /**
   * Given the position in the sequence of pagination links [i],
   * figure out what page number corresponds to that position.
   */
  private calculatePageNumber(page: number, currentPage: number,
                              paginationRange: number, totalPages: number) {
    if (page === paginationRange) {
      return totalPages;
    }

    if (page === 1) {
      return page;
    }

    let halfWay = Math.ceil(paginationRange / 2);
    if (paginationRange < totalPages) {
      if (totalPages - halfWay < currentPage) {
        return totalPages - paginationRange + page;
      }

      if (halfWay < currentPage) {
          return currentPage - halfWay + page;
      }
    }
    return page;
  }
}
