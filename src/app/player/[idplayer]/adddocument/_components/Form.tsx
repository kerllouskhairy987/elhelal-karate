"use client";
import { UploadImageDocument } from "@/app/player/add/_action/player";
import { Button } from "@/components/ui/button";
import { validationErrors } from "@/types";
import { Image as ImageType, Player } from "@prisma/client";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ImageGallery from "../../view/_components/ImageGallery";
type InitialStateType = {
  message?: string;
  error?: validationErrors;
  status?: number | null;
};
const initialState: InitialStateType = {
  message: "",
  error: {},
  status: null,
};
type PlayerWithImages = Player & {
  images: ImageType[];
};
const Form = ({ playerId, player }: { playerId: string; player: PlayerWithImages }) => {
  const [selectedImage, setSelectedImage] = useState("");

  const [state, action, pending] = useActionState(
    UploadImageDocument.bind(null, playerId),
    initialState
  );

  useEffect(() => {
    if (state.message) {
      toast.success(state.message, {
        className: state.status === 200 ? "text-green-400" : "text-destructive",
      });
    }
  }, [state.message, state.status]);
  
  return (
    <div>
      <div className="max-w-md mx-auto mt-10 border rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-primary mb-4">
          رفع مستند
        </h2>

        <form action={action} className="space-y-4">
          <UploadImage
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </div>
      <div>
        <ImageGallery images={player.images} playerId={playerId} />
      </div>
    </div>
  );
};

export default Form;

const UploadImage = ({
  setSelectedImage,
  selectedImage,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
  selectedImage: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageChange}
        name="image" // Important: allows FormData to pick it up
      />
      {!selectedImage ? (
        <label
          htmlFor="image-upload"
          className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-primary text-primary rounded-xl cursor-pointer hover:bg-primary/10 transition"
        >
          <CameraIcon className="w-8 h-8" />
        </label>
      ) : (
        <label htmlFor="image-upload" className="cursor-pointer">
          <Image
            src={selectedImage as string}
            alt="Preview"
            width={192}
            height={192}
            className="object-cover rounded-xl border"
          />
        </label>
      )}
    </div>
  );
};
