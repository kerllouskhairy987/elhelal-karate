"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { deleteUserAction } from "../actions/auth";
import { toast } from "react-toastify";
import { useState } from "react";

interface IProps {
    id: string;
}
const DeleteUserBtn = ({ id }: IProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteUser = async () => {
        setIsLoading(true);
        const res = await deleteUserAction(id);
        if (res.success) {
            toast.success(res.error);
        } else {
            toast.error(res.error);
        }
        setIsLoading(false);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild >
                <Button variant="destructive">حذف</Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                    <AlertDialogTitle>هل انت متأكد أنك تريد حذف الحساب؟</AlertDialogTitle>
                    <AlertDialogDescription>لا يمكنك التراجع عن هذا الإجراء</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteUser}>
                        {isLoading ? "جاري الحذف..." : "حذف"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteUserBtn