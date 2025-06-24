'use client';

import { usePathname } from 'next/navigation';
import { Header } from "../components/common/header";
import { Footer } from "@/components/common/footer";

export default function LayoutClient({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const isHidden = pathname.startsWith('/auth/login') || pathname.startsWith('/dashboard');
    return (
        <>
      {!isHidden && <Header />}
      <main>{children}</main>
      {!isHidden && <Footer />}
    </>
    )
}