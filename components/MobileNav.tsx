"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          {/* SheetTrigger asChild means that it is a child of a Sheet component */}
          <Image
            src="/icons/hamburger.svg"
            width={36}
            height={36}
            alt="hamburger icon"
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-dark-1">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/icons/logo.svg"
              width={32}
              height={32}
              alt="Hive logo"
              className="max-sm:size-10"
            />
            <p className="text-[26px] font-extrabold text-white">HIVE</p>
          </Link>

          {/* we do h-[calc(100vh-72px)] because we want the height to be full but exclusing the navbar, 100 vh is the full height btw*/}
          {/* overflow-y-auto so that there will be no scrollbar */}
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            {/* sheetclose means that whatever we click outside or inside the sidebar, it will close */}
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-6 text-white">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.route;

                  return (
                    <SheetClose asChild key={link.route}>
                      <Link
                        href={link.route}
                        key={link.label}
                        className={cn(
                          "flex gap-4 items-center p-4 rounded-lg w-full max-w-60",
                          { "bg-blue-1": isActive }
                        )}
                      >
                        {/* cn is short for className and it allows us to add multiple and dynamic className */}
                        <Image
                          src={link.imgUrl}
                          alt={link.label}
                          width={20}
                          height={20}
                        />
                        <p className="font-semibold">{link.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
