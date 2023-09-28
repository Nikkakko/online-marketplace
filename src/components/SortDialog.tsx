import * as React from 'react';

import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SortDialogProps {
  handleSort: (sort: { sort: string }) => void;
  head: {
    title: string;
    sort: string;
  };
}

const SortDialog: React.FC<SortDialogProps> = ({ handleSort, head }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{head.title}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => handleSort({ sort: `${head.sort}.asc` })}
        >
          <DropdownMenuLabel className='flex gap-2'>
            <ArrowUpIcon className='w-4 h-4' aria-hidden='true' />
            Asc
          </DropdownMenuLabel>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSort({ sort: `${head.sort}.desc` })}
        >
          <DropdownMenuLabel className='flex gap-2'>
            <ArrowDownIcon className='w-4 h-4' aria-hidden='true' />
            Desc
          </DropdownMenuLabel>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDialog;
