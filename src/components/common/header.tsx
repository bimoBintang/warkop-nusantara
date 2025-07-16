"use client";

import { Coffee, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect} from "react";


export const Header = ()=> {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-amber-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
          }`}>
            <nav className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coffee className="h-8 w-8 text-amber-300" />
                  <span className="text-2xl font-bold text-white">Warkop Bangboy</span>
                </div>
                
                <div className="hidden md:flex items-center space-x-8">
                  <Link href="#home" className="text-white hover:text-amber-300 transition-colors">Beranda</Link>
                  <Link href="#menu" className="text-white hover:text-amber-300 transition-colors">Menu</Link>
                  <Link href="#about" className="text-white hover:text-amber-300 transition-colors">Tentang</Link>
                  <Link href="#contact" className="text-white hover:text-amber-300 transition-colors">Kontak</Link>
                </div>
    
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden text-white"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
    
              {/* Mobile Menu */}
              {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-amber-900/95 backdrop-blur-sm">
                  <div className="flex flex-col space-y-4 p-4">
                    <Link href="#home" className="text-white hover:text-amber-300 transition-colors">Beranda</Link>
                    <Link href="#menu" className="text-white hover:text-amber-300 transition-colors">Menu</Link>
                    <Link href="#about" className="text-white hover:text-amber-300 transition-colors">Tentang</Link>
                    <Link href="#contact" className="text-white hover:text-amber-300 transition-colors">Kontak</Link>
                  </div>
                </div>
              )}
            </nav>
          </header>
    
    )
}