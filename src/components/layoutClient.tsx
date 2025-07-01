'use client';

import { usePathname } from 'next/navigation';
import { Header } from "../components/common/header";
import { Footer } from "@/components/common/footer";

export default function LayoutClient({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const isHidden = pathname.startsWith('/auth/login') || pathname.startsWith('/dashboard') || pathname.startsWith('/checkout') || pathname.startsWith('/order-success');
    return (
        <>
      {!isHidden && <Header />}
      <main>{children}</main>
      {!isHidden && <Footer />}
    </>
    )
}