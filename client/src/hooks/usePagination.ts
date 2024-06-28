import { useMemo, useState } from "react";

export const usePagination = ({ rows }: { rows: number }) => {
  // state: per_page and curr_page
  const [perpage, setPerpage] = useState(5);
  const [currPage, setCurrPage] = useState(1);

  const totalPage = useMemo(() => Math.ceil(rows / perpage), [rows, perpage]);
  const onNextPage = () => {
    setCurrPage(currPage + 1);
  };
  const onPrevPage = () => {
    setCurrPage(currPage - 1);
  };
  const onPerPageChange = (perPage: number) => {
    setPerpage(perPage);
    setCurrPage(1);
  };

  const onGoToEnd = () => {
    setCurrPage(totalPage);
  };

  const onGoToStart = () => {
    setCurrPage(1);
  };

  return {
    totalPage,
    perpage,
    currPage,
    onNextPage,
    onPrevPage,
    onPerPageChange,
    onGoToEnd,
    onGoToStart,
  };
};
