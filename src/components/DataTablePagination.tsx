import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface DataTablePaginationProps {
  totalProducts: number;
  limit: number;
  offset: number;
  handleRowsPerPage: (limit: number, page: number) => void;
}

const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  totalProducts,
  limit,
  offset,
  handleRowsPerPage,
}) => {
  const pageSizeOptions = [10, 20, 30, 40, 50];

  return (
    <div className='flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8'>
      <div className='flex items-center space-x-2'>
        <p className='whitespace-nowrap text-sm font-medium'>Rows per page</p>
        <Select
          defaultValue={`${limit}`}
          onValueChange={value => {
            handleRowsPerPage(parseInt(value), offset);
          }}
        >
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue placeholder={`${limit}`} />
          </SelectTrigger>
          <SelectContent side='top'>
            {pageSizeOptions.map(pageSize => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center space-x-2'>
        <p className='whitespace-nowrap text-sm font-medium'>Page</p>
        <Select
          defaultValue={`${offset / limit + 1}`}
          onValueChange={value => {
            handleRowsPerPage(limit, parseInt(value));
          }}
        >
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue placeholder={`${offset / limit + 1}`} />
          </SelectTrigger>
          <SelectContent side='top'>
            {Array.from(
              { length: Math.ceil(totalProducts / limit) },
              (_, i) => i + 1
            ).map(page => (
              <SelectItem key={page} value={`${page}`}>
                {page}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DataTablePagination;
