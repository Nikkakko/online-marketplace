'use client';
// import '@uploadthing/react/styles.css';
import * as React from 'react';
import { Button } from '@/components/ui/button';

import {
  Form,
  FormControl,
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
import {
  addProductsAction,
  removeImagesAction,
  updateProductAction,
} from '@/app/_actions/product';
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
import { cn, isArrayOfFile } from '@/lib/utils';

import { FileWithPreview } from '@/types';
import { Products } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface AddProductFormProps {
  initialData?: Products;
}

type Inputs = z.infer<typeof addProductsSchema>;
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

const AddProductForm: React.FC<AddProductFormProps> = ({ initialData }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);
  const [initialImages, setInitialImages] = React.useState<
    string[] | undefined
  >(initialData?.images);

  const [isPending, startTransition] = React.useTransition();
  const { isUploading, startUpload } = useUploadThing('imageUploader');

  const priceAsString = initialData?.price.toString();

  const form = useForm<Inputs>({
    resolver: zodResolver(addProductsSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      category: initialData?.category ?? 'clothing',
      description: initialData?.description ?? '',
      price: priceAsString ?? '',
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

  const handleImageUpdate = (image: string) => {
    startTransition(async () => {
      if (initialData?.id && initialImages) {
        await removeImagesAction(
          initialData?.id,
          initialImages.filter(img => img !== image)
        );
      }

      setInitialImages(
        images => images?.filter(img => img !== image) ?? undefined
      );
    });
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
        if (!files && !initialImages) {
          throw new Error('No files selected');
        }

        // if files size is greater than 4mb
        if (
          files &&
          files?.reduce((acc, file) => acc + file.size, 0) > 4000000
        ) {
          toast({
            title: 'Error',
            description: 'File size is too large. max 4mb.',

            duration: 5000,
          });
          return;
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

        if (initialData) {
          await updateProductAction(initialData?.id, {
            title: data.title,
            description: data.description,
            category: data.category,
            price: parseInt(data.price),
            images: images?.map(image => image.url) ?? [],
          });
          toast({
            title: 'Product updated successfully',
            description: 'Product has been updated successfully.',

            duration: 5000,
          });

          form.reset();
          router.push('/dashboard/stores');

          return;
        }

        await addProductsAction(data, images ?? null);

        toast({
          title: 'Product added successfully',
          description: 'Product has been added successfully.',

          duration: 5000,
        });

        form.reset();
        router.push('/dashboard/stores');
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
                  className='resize-none'
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
            <div className='flex flex-wrap gap-2'>
              {files && (
                <div className='flex flex-wrap gap-2'>
                  {files?.map((file, idx) => (
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
                        className='absolute top-0 right-0 z-10 p-2 text-white bg-red-500 rounded-full'
                        onClick={async () => {
                          setFiles(
                            files =>
                              files?.filter(f => f.name !== file.name) ?? null
                          );
                        }}
                        disabled={isPending || isUploading}
                      >
                        <Icons.remove className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {initialImages && (
                <div className='flex flex-wrap gap-2'>
                  {initialImages?.map((image, idx) => (
                    <div
                      key={image}
                      className='relative w-20 h-20 overflow-hidden rounded-md'
                    >
                      <Image
                        src={image}
                        alt={image}
                        fill
                        className='absolute inset-0 object-cover w-full h-full'
                      />
                      <Button
                        type='button'
                        className='absolute top-0 right-0 z-10 p-2 text-white bg-red-500 rounded-full'
                        onClick={() => handleImageUpdate(image)}
                        disabled={isPending || isUploading}
                      >
                        <Icons.remove className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.images?.message}
          />
        </FormItem>

        <label htmlFor='imageUploader' className='file-upload-button'>
          <div
            className={cn(
              'flex items-center justify-center gap-2 border-2 border-dashed rounded-md cursor-pointer hover:border-primary-foreground p-4',
              isPending || isUploading ? 'opacity-50 pointer-events-none' : ''
            )}
            aria-label='Click to upload images'
          >
            <Icons.upload className='w-6 h-6' />
            <span>Upload images</span>
          </div>
        </label>

        <Input
          type='file'
          id='imageUploader'
          multiple
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
          disabled={isPending || isUploading}
        />

        <Button
          type='submit'
          className='w-full'
          disabled={isPending || isUploading}
        >
          {initialData ? 'Update Product' : 'Add Product'}
        </Button>
      </form>
    </Form>
  );
};

export default AddProductForm;
