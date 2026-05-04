import { Outlet } from "react-router-dom";
import Header from "./Header";
import CartDrawer from "./CartDrawer";
import Footer from "./Footer";

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
