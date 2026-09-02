import CartDrawer from "@/features/landing-page/components/cartDrawer";
import Header from "./navbar";
import Footer from "./footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-cream-100 text-charcoal-900 flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}