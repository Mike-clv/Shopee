import React, { useRef, useState } from 'react';
import { ImagePlus, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { localClient } from '@/api/localClient';

export default function ImageUploadButton({
  onUploaded,
  className = '',
  label = 'Tải ảnh lên',
  size = 'sm',
  variant = 'outline',
}) {
  const fileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePick = () => {
    fileRef.current?.click();
  };

  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await localClient.uploads.image(file);
      onUploaded?.(result.url, file);
      toast.success('Đã tải ảnh lên thành công');
    } catch (error) {
      toast.error(error.message || 'Upload ảnh thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={handlePick}
        disabled={isUploading}
      >
        {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        {label}
      </Button>
    </>
  );
}
