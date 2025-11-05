import Image from "next/image"
import Logo from "../../../public/Logo.jpg"
import LoginFrom from "./LoginFrom"
import { verifyToken } from "@/utils/verifyToken"
import { cookies } from "next/headers"

const LoginPage = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get('JwtToken')?.value || ""
    const user = verifyToken(token)
    console.log(user)  // ==> user --> {id, name, email, role}
    return (
        <main>
            <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-10">
                <div className="relative w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden animate-pulse duration-150">
                    <Image src={Logo} alt="Image For Login" fill />
                </div>
                <div className="border p-10 rounded-md w-full">
                    <LoginFrom role={user?.role} />
                </div>
            </div>
        </main>
    )
}

export default LoginPage