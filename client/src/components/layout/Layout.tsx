import { Header } from "./Header";
import { Footer } from "./Footer";
import { Body } from "./Body";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <Body />
      <Footer />
    </div>
  );
};