
declare module ngPagination {
  class PaginationControlsCpm { }

  interface IPaginationInstance {
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

  class PaginationService {
    defaultId: string;

    register(instance: IPaginationInstance);

    update(paginationId: string, update: { itemsPerPage: number, totalItems: number });

    getCurrentPage(paginationId: string): number;

    getItemsPerPage(paginationId: string): number;

    getTotalItems(paginationId: string): number;

    setCurrentPage(paginationId: string, page: number);

    setTotalItems(paginationId: string, totalItems: number);

    getInstance(paginationId: string): IPaginationInstance;
  }

  class PaginatePipe { }
}

declare module "ng2-pagination" {
  export = ngPagination;
}
