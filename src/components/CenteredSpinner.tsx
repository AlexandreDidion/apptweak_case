import { Disc3Icon, type LucideProps } from "lucide-react";

export function CenteredSpinner({ ...props }: LucideProps) {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Disc3Icon className="animate-spin" size={46} {...props} />
    </div>
  );
}
