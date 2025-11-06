"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deletePlayer } from "../add/_action/player";

type StateType = {
  isLoading: boolean;
  message: string;
  status: number | null;
};

const DeletePlayer = ({ id, publicId }: { id: number; publicId: string }) => {
  const [state, setState] = useState<StateType>({
    isLoading: false,
    message: "",
    status: null,
  });

  const handleDelete = async () => {
    setState((prev) => {
      return { ...prev, isLoading: true };
    });
    try {
      const res = await deletePlayer({ id, publicId: publicId });
      setState((prev) => {
        return { ...prev, message: res.message, status: res.status };
      });
    } catch (error) {
      console.log(error);
    } finally {
      setState((prev) => {
        return { ...prev, isLoading: false };
      });
    }
  };

  return (
    <Button
      variant="secondary"
      disabled={state.isLoading}
      onClick={handleDelete}
    >
      <Trash2 />
    </Button>
  );
};

export default DeletePlayer;
