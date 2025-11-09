import { Heart } from "lucide-react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t p-4 flex justify-center items-center gap-2 text-sm text-muted-foreground">
      <span>{year}</span>
      <span>- Made with</span>
      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
    </footer>
  );
};
