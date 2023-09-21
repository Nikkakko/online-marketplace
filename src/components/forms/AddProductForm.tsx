'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { generateReactHelpers } from "@uploadthing/react/hooks"
import { useForm } from 'react-hook-form';

import { type z } from 'zod';
import { useToast } from '../ui/use-toast';

interface AddProductFormProps {}

const AddProductForm: React.FC<AddProductFormProps> = ({}) => {
  return <div>AddProductForm</div>;
};

export default AddProductForm;
