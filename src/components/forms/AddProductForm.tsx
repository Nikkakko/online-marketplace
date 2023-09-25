'use client';
// import '@uploadthing/react/styles.css';
import * as React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import { useForm } from 'react-hook-form';

import { type z } from 'zod';
import { useToast } from '../ui/use-toast';
import { addProductsAction } from '@/app/_actions/product';
import { addProductsSchema } from '@/lib/validations/product';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Icons } from '../icons';
import { productCategories } from '@/config/products';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import Image from 'next/image';
import { UploadFileResponse } from 'uploadthing/client';
import { cn, isArrayOfFile } from '@/lib/utils';
import { get } from 'http';
import { UploadButton } from '@/utils/uploadthing';
import { FileWithPreview } from '@/types';

interface AddProductFormProps {}

type Inputs = z.infer<typeof addProductsSchema>;
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const AddProductForm: React.FC<AddProductFormProps> = ({}) => {
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);

  const [isPending, startTransition] = React.useTransition();

  const { toast } = useToast();
  const { isUploading, startUpload } = useUploadThing('imageUploader');

  const form = useForm<Inputs>({
    resolver: zodResolver(addProductsSchema),
    defaultValues: {
      title: '',
      category: 'clothing',
      description: '',
      price: '',
      images: [],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const filesWithPreview = files.map(file => {
      return Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
    });
    setFiles(filesWithPreview);
  };

  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        if (!files) {
          throw new Error('No files selected');
        }

        const images = isArrayOfFile(files)
          ? await startUpload(files).then(res => {
              const formattedImages = res?.map(image => ({
                id: image.key,
                name: image.key.split('_')[1] ?? image.key,
                url: image.url,
              }));
              return formattedImages ?? null;
            })
          : null;

        console.log(images);

        await addProductsAction(data, images ?? null);

        toast({
          title: 'Product added successfully',
          description: 'Product has been added successfully.',

          duration: 5000,
        });

        form.reset();
        setFiles(null);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Something went wrong.',

          duration: 5000,
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form
        className='grid w-full max-w-2xl gap-5'
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Type product name here.' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Type product description here'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex flex-col items-start gap-6 sm:flex-row'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value: typeof field.value) =>
                      field.onChange(value)
                    }
                  >
                    <SelectTrigger className='capitalize'>
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(productCategories).map(option => (
                          <SelectItem
                            key={option.title}
                            value={option.title}
                            className='capitalize'
                          >
                            {option.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder='Type product price here.' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <FormLabel>Images</FormLabel>
          <FormControl>
            {files && (
              <div className='flex flex-wrap gap-2'>
                {files.map(file => (
                  <div
                    key={file.name}
                    className='relative w-20 h-20 overflow-hidden rounded-md'
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fill
                      className='absolute inset-0 object-cover w-full h-full'
                    />
                    <Button
                      type='button'
                      className='absolute top-0 right-0 z-10 p-1 text-white bg-red-500 rounded-full'
                      onClick={() => {
                        setFiles(
                          files =>
                            files?.filter(f => f.name !== file.name) ?? null
                        );
                      }}
                    >
                      <Icons.remove className='w-4 h-4' />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.images?.message}
          />
        </FormItem>

        <Input
          type='file'
          multiple
          accept='image/*'
          onChange={handleFileChange}
        />

        <Button
          type='submit'
          className='w-full'
          disabled={isPending || isUploading}
        >
          Add product
        </Button>
      </form>
    </Form>
  );
};

export default AddProductForm;
