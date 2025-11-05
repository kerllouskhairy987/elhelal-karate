"use client";

import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
    const router = useRouter();
    return (
        <div className='flex flex-col justify-center items-center gap-3 h-screen'>
            <h2 className='text-xl font-semibold '>صفحة غير موجوده</h2>
            <p className='text-lg text-accent-foreground/50'>الصفحة التي تحاول الوصول لها غير موجودة</p>
            <div className='flex gap-3 '>
            <Link href="/" className={`${buttonVariants()}`}>الصفحة الرئيسية</Link>
            <Button onClick={() => router.refresh()} variant={"outline"}>اعادة التحميل</Button>
            </div>
        </div>
    )
}