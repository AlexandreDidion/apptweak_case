import { Link } from "@tanstack/react-router";
import { House, Search } from "lucide-react";
import { ReactNode } from "react";

import { ModeToggle } from "@/components/ModeToggle";
import { buttonVariants } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface MainHeaderProps {
  userAvatar?: ReactNode;
}

export function MainHeader({ userAvatar }: MainHeaderProps) {
  return (
    <header className="flex h-16 w-full items-center gap-4 rounded-b-2xl bg-card px-4 text-card-foreground shadow-md ring-1 ring-foreground/10">
      <Link
        to="/"
        aria-label="Home"
        className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "rounded-full")}
      >
        <House />
      </Link>

      <div className="w-full max-w-md">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput type="search" placeholder="Search tracks" aria-label="Search tracks" />
        </InputGroup>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <ModeToggle />
        {userAvatar}
      </div>
    </header>
  );
}
