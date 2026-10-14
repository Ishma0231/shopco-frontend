import { LoaderCircle } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center py-10">
      <LoaderCircle
        size={36}
        strokeWidth={1.8}
        className="animate-spin text-zinc-700 dark:text-white"
      />
    </div>
  );
}