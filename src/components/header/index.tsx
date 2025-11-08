import logo from "../../../public/Logo.jpg";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ModeToggle } from "../ModeToggle";
import Image from "next/image";
import { JWTPayload } from "@/types";
import { logoutAction } from "@/app/actions/auth/logout";
import { toast } from "react-toastify";
import { useState } from "react";
import Loader from "../ui/Loader";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarWidth: number;
  user: JWTPayload | null;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  sidebarWidth,
  user
}: NavbarProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  console.log(pathname + "\n" + pathSegments);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logoutAction();
      setIsLoading(false);
      toast.success("تم تسجيل الخروج بنجاح", { autoClose: 5000 });
      router.replace("/login");

    } catch (error) {
      console.log(error)
      toast.error("حدث خطاء في السرفر", { autoClose: 5000 });
    } finally {
      setIsLoading(false);
    }
  };
  console.log(user?.name)

  return (
    <nav
      className="fixed top-0 left-0 z-50 bg-card  font-arabic transition-all duration-300"
      style={{ right: `${sidebarOpen ? sidebarWidth : 64}px` }}
    >
      <div className="flex items-center justify-between h-[73px] px-4">
        {/* Right side - Menu Toggle Button */}
        <div className="flex items-center gap-3 shrink-0">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="text-primary w-10 h-10 shrink-0"
            >
              <Menu className="w-6! h-6! " />
            </Button>
          )}
        </div>
        <div className="hidden flex-1  md:flex items-center gap-3 shrink-0 text-card-foreground">
          <Image
            src={logo}
            alt="الهلال"
            width={50}
            height={30}
            priority
            className="w-10 h-10 rounded-xl"
          />
          <span className="font-bold text-[14px]">
            نظام حضور وانصراف اللاعبين
          </span>
        </div>

        {/* Left side - User Profile and Icons */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex gap-2">
            <ModeToggle />
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-0 flex items-center gap-3 min-w-0 "
              >
                {/* Avatar with initials */}
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-primary/20 text-primary flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {user?.name
                      .split(" ")
                      .map((name) => name.charAt(0))
                      .join("")}
                  </span>
                </div>
                <div className="flex  min-w-0 text-left">
                  <h3 title={user?.name} className="max-w-18 line-clamp-1 font-bold text-card-foreground text-sm truncate">
                    {user?.name}
                  </h3>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 font-arabic border shadow-md"
              align="start"
            >
              <DropdownMenuItem asChild>
                <Link href="/profile/edit" className="cursor-pointer">
                  تعديل الحساب
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive"
              >
                { isLoading? <Loader /> : "تسجيل الخروج"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
