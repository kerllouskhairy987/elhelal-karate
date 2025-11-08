"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { CircleUser, House, NotebookPen, PanelRightClose, User } from "lucide-react";
import logo from "../../../public/Logo.jpg";
import Link from "../Link";
import { UserRole } from "@prisma/client";

interface SidebarProps {
  isOpen: boolean;
  sidebarWidth: number;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  role: UserRole | undefined
}

const sidebarMenus = [
  {
    label: "الرئيسية",
    icon: House,
    href: "/",
    clientRole: UserRole.ADMIN,
  },
  {
    label: "المدربين",
    icon: CircleUser,
    href: "/trainer",
    clientRole: UserRole.ADMIN,
  },
  {
    label: "اللاعبين",
    icon: CircleUser,
    href: "/player",
    clientRole: UserRole.TRAINER,
  },
  {
    label: "الغياب",
    icon: NotebookPen,
    href: "/attendance",
    clientRole: UserRole.TRAINER,
  },
];

export default function Sidebar({
  isOpen,
  sidebarWidth,
  setSidebarOpen,
  role
}: SidebarProps) {
  const pathname = usePathname();
  console.log(role)

  return (
    <aside
      className={`fixed top-0 right-0 h-full bg-card text-card-foreground transition-all duration-300 z-40 font-arabic shadow-sm border-l border-border overflow-hidden`}
      style={{ width: isOpen ? `${sidebarWidth}px` : "64px" }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div
          className={`h-[73px] flex items-center border-b border-border transition-all duration-300 ${isOpen ? "p-3" : "p-2 justify-center"
            }`}
        >
          {isOpen ? (
            <div className="flex items-center justify-between w-full">
              <Image
                src={logo}
                alt="Logo"
                width={45}
                height={45}
                className="rounded-xl"
              />
              <button
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="text-primary hover:opacity-80 transition"
              >
                <PanelRightClose className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <Image
              src={logo}
              alt="Logo"
              width={40}
              height={40}
              className="rounded-xl"
            />
          )}
        </div>

        {/* Main Menu */}
        <nav className="flex-1 overflow-y-auto p-2" dir="rtl">
          {
            role === UserRole.ADMIN
              ? (
                sidebarMenus.map((menu) => {
                  const Icon = menu.icon;
                  const isActive = pathname === menu.href;

                  return (
                    <Link
                      key={menu.label}
                      href={menu.href ?? "/"}
                      className={`flex items-center mb-4 text-sm rounded-lg cursor-pointer transition-all duration-200 py-3
                  ${isOpen
                          ? "justify-start text-right px-3"
                          : "justify-center px-0"
                        }
                  ${isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                    >
                      <Icon className={`w-5 h-5 ${isOpen ? "ml-2" : ""}`} />
                      {isOpen && <span>{menu.label}</span>}
                    </Link>
                  );
                })
              )
              : (
                sidebarMenus.filter((menu) => menu.clientRole === role).map((menu) => {
                  const Icon = menu.icon;
                  const isActive = pathname === menu.href;

                  return (
                    <Link
                      key={menu.label}
                      href={menu.href ?? "/"}
                      className={`flex items-center mb-4 text-sm rounded-lg cursor-pointer transition-all duration-200 py-3
                  ${isOpen
                          ? "justify-start text-right px-3"
                          : "justify-center px-0"
                        }
                  ${isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                    >
                      <Icon className={`w-5 h-5 ${isOpen ? "ml-2" : ""}`} />
                      {isOpen && <span>{menu.label}</span>}
                    </Link>
                  );
                })
              )
          }

        </nav>

        {/* Footer */}
        <footer className="p-4 border-t border-border text-center text-xs text-muted-foreground">
          {isOpen ? (
            <>
              جميع الحقوق محفوظة لصالح <br /> الهلال للكاراتيه © 2025
            </>
          ) : (
            "© 2025"
          )}
        </footer>
      </div>
    </aside>
  );
}
