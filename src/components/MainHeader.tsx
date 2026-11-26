import { Link } from "@tanstack/react-router";
import { HouseIcon } from "lucide-react";
import { ReactNode } from "react";

import { ModeToggle } from "@/components/ModeToggle";
import { buttonVariants } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface MainHeaderProps {
  search?: ReactNode;
  userAvatar?: ReactNode;
}

export function MainHeader({ search, userAvatar }: MainHeaderProps) {
  return (
    <header className="flex h-16 w-full items-center gap-2 bg-card px-2 sm:gap-4 sm:px-4 text-card-foreground shadow-md ring-1 ring-foreground/10">
      {/* Lives in the header so it stays reachable on mobile, where the sidebar is a closed sheet */}
      <SidebarTrigger className="rounded-full" />
      <Link
        to="/"
        aria-label="Home"
        className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "rounded-full")}
      >
        <HouseIcon />
      </Link>

      {/* min-w-0: lets the search shrink on small screens instead of pushing the rest out */}
      <div className="min-w-0 flex-1 md:max-w-xl lg:max-w-2xl">{search}</div>

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        <ModeToggle />
        {userAvatar}
      </div>
    </header>
  );
}
