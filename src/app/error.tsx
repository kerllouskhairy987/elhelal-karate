'use client' // Error boundaries must be Client Components

import { Button, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter();

    return (
        <div className='flex flex-col items-center justify-center gap-10 h-screen'>
            <h2>حدث خطاء اثناء التحميل</h2>
            <p>{error.message}</p>
            <div className='flex gap-3'>
                <Link href={"/"} className={`${buttonVariants({ variant: "outline" })}`}>Home</Link>
                <Button
                    onClick={
                        () => {
                            router.refresh()
                            reset()
                        }
                    }
                >
                    Try again
                </Button>
            </div>
        </div>
    )
}