import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import React from 'react';

interface PaginationButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  pageCount: number;
  page: string;
  per_page?: string;
  sort: string;
  router: AppRouterInstance;
  pathname: string;
  siblingCount?: number;
}

const PaginationButton = ({}: PaginationButtonProps) => {
  return <div>PaginationButton</div>;
};

export default PaginationButton;
