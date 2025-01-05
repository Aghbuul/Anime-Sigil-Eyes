import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onImageLoaded: (image: HTMLImageElement) => void;
}

export function ImageUpload({ onImageLoaded }: ImageUploadProps) {
  // Handle file drop event - processes everything client-side
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Use FileReader to handle the image client-side without uploading
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => onImageLoaded(image);
      image.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [onImageLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12
        flex flex-col items-center justify-center
        cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
      <p className="text-lg font-medium text-center">
        {isDragActive ? (
          "Drop the image here"
        ) : (
          "Drag & drop an image here, or click to select"
        )}
      </p>
      <div className="text-sm text-muted-foreground mt-2 space-y-1 text-center">
        <p>Upload a photo with your face clearly visible, preferably close-up</p>
        <p>Images are processed entirely in your browser for privacy</p>
        <p>Supports PNG, JPG and GIF</p>
      </div>
    </div>
  );
}