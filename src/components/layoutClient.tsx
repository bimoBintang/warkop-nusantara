'use client';

import { usePathname } from 'next/navigation';
import { Header } from "../components/common/header";
import { Footer } from "@/components/common/footer";

export default function LayoutClient({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const hiddenPaths = ['/auth/login', '/dashboard', '/checkout', '/order-success', '/menu-list', '/order'];
    const isHidden = hiddenPaths.some((path) => pathname.startsWith(path));
    return (
        <>
      {!isHidden && <Header />}
      <main>{children}</main>
      {!isHidden && <Footer />}
    </>
    )
}