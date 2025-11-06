"use client";
import { deleteImage } from "@/app/player/add/_action/player";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Image as ImageType } from "@prisma/client";
import { Eye, X, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

type StateType = {
  isLoading: boolean;
  message: string;
  status: number | null;
};

const ImageGallery = ({ images, playerId }: { images: ImageType[]; playerId: string }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<ImageType | null>(null);
  const [state, setState] = useState<StateType>({
    isLoading: false,
    message: "",
    status: null,
  });

  const handleDelete = async (image: ImageType) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await deleteImage({
        id: image.id.toString(),
        playerId: playerId,
        publicId: image.publicId as string,
      });
      setState((prev) => ({ ...prev, message: res.message, status: res.status }));
      toast.success("تم حذف الصورة بنجاح");
      setImageToDelete(null);
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء حذف الصورة");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const openDeleteConfirmation = (image: ImageType, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageToDelete(image);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="aspect-square relative rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedImage(image.url)}
          >
            <Image
              src={image.url as string}
              alt={`صورة ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => openDeleteConfirmation(image, e)}
              disabled={state.isLoading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* معاينة الصورة */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-none">
          <div className="relative">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="معاينة الصورة"
                width={800}
                height={600}
                className="rounded-lg w-full h-auto"
              />
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-12 right-0"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* تأكيد الحذف باستخدام AlertDialog */}
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && !state.isLoading && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من أنك تريد حذف هذه الصورة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row-reverse gap-2">
            <AlertDialogCancel 
              onClick={() => setImageToDelete(null)}
              disabled={state.isLoading}
            >
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => imageToDelete && handleDelete(imageToDelete)}
              disabled={state.isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {state.isLoading ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ImageGallery;