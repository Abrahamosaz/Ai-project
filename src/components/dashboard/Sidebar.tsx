"use client";

import { sideBars } from "@/app/constants";
import { useDashboardStore } from "@/store/dashboard.store";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const { isSideBarShrink, setIsNavOpen } = useDashboardStore();
  const pathname = usePathname();

  return (
    <aside
      className={`w-full h-screen pt-5 bg-white border-r transition-all duration-300 ${
        isSideBarShrink ? "w-16 md:w-fit" : "w-64 md:w-[25%]"
      }`}
    >
      <nav className="p-4">
        <ul className="w-full flex flex-col gap-4">
          {sideBars.map((item) => (
            <li key={item.id}>
              <Link
                href={item.link}
                onClick={() => setIsNavOpen(false)}
                className={`flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                  pathname === item.link ? "bg-gray-100" : ""
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!isSideBarShrink && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
