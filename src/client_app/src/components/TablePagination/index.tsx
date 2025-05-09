import { Pagination } from "react-bootstrap";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import { PaginationModel } from "@/models/pagination";
import { EllipsisBtn, NextBtn, PageItemBtn, PrevBtn } from "./styles";
import { DOTS, usePagination } from "@/hooks/usePagination";

interface PaginationProps extends PaginationModel {
  pageChanged: (page: number) => void;
}

function TablePagination(props: PaginationProps) {
  const { totalItems, currentPage, pageSize, pageChanged } = props;

  const totalTabs: number =
    Math.floor(totalItems / pageSize) + (totalItems % pageSize === 0 ? 0 : 1);

  const tabItems = usePagination({
    currentPage: currentPage,
    totalCount: totalItems,
    pageSize: pageSize,
  });

  return (
    <Pagination className="mb-0 d-flex gap-1">
      {totalTabs > 1 && (
        <>
          <span className="d-flex align-items-center">
            Page {currentPage} of {totalTabs}
          </span>
          <PrevBtn
            data-testid="prevBtn"
            onClick={() => pageChanged(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <BiChevronLeft size={20} />
          </PrevBtn>
          {tabItems?.map((pageNumber: any, pageIdx: number) => {
            if (pageNumber === DOTS) {
              return (
                <EllipsisBtn data-testid="ellipsisBtn" key={pageIdx} disabled />
              );
            }

            return (
              <PageItemBtn
                onClick={(function (index: any) {
                  return function () {
                    pageChanged(index);
                  };
                })(pageNumber)}
                active={currentPage === pageNumber}
                key={pageIdx}
              >
                {pageNumber}
              </PageItemBtn>
            );
          })}

          <NextBtn
            data-testid="nextBtn"
            onClick={() => pageChanged(currentPage + 1)}
            disabled={currentPage === totalTabs}
          >
            <BiChevronRight size={20} />
          </NextBtn>
        </>
      )}
    </Pagination>
  );
}

export default TablePagination;
