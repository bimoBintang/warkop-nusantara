import { Coffee } from "lucide-react"
import Link from "next/link"


export const Footer = ()=> {
    return (
        <footer className="bg-amber-950 text-white py-8">
            <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
                <Coffee className="h-6 w-6 text-amber-300" />
                <span className="text-xl font-bold">Warkop Bangboy</span>
            </div>
            <p className="text-amber-200">
                Email: warkopbangboy47@gmai.com
            </p>
            <p className="text-amber-200">
                No telp: 0858449892754
            </p>
            <p className="text-amber-200">
                Alamat: KOPI SEMPER, RT.1/RW.1, Semper Bar., Kec. Cilincing, Kota Jkt Utara, Daerah Khusus Ibukota Jakarta 14130 Jakarta, Indonesia
            </p>
            <Link href='/auth/login' className="text-amber-200">admin panel</Link>
            </div>
      </footer>
    )
}