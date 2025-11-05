import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './utils/verifyToken';

export async function proxy(request: NextRequest) {
    const cookieStore = await cookies()
    const token = cookieStore.get('JwtToken')?.value || "";

    const user = verifyToken(token)

    if (!token) {
        return NextResponse.next();
    } else if (request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL('/', request.url));
    }

}

export const config = {
    matcher: ['/', '/login', '/trainer', '/trainer/:path*'],
}