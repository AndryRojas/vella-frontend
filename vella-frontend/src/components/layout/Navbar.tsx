import Image from "next/image";
import Link from "next/link";
import icon from "../../../public/images/icon-vellatech.jpg";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-vella-gold/30 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
        <nav className="flex items-center gap-4 text-sm font-medium text-vella-navy">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={icon}
              alt="VellaTech"
              className="h-9 w-9 rounded-full object-cover"
              priority
            />
          </Link>
          <Link href="/" className="transition-colors hover:text-vella-wine">
            Inicio
          </Link>
        </nav>
        <Link
          href="/contacto"
          className="rounded-full border border-vella-wine px-5 py-2 text-sm font-medium text-vella-wine transition-colors hover:bg-vella-wine hover:text-white"
        >
          Contáctanos
        </Link>
      </div>
    </header>
  );
}
