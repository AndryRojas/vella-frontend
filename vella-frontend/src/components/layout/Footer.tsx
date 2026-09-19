import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-vella-gold/20 bg-vella-navy">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 text-white/70 sm:flex-row sm:justify-between">
        <Logo size="sm" />
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="transition-colors hover:text-vella-gold">
            Inicio
          </Link>
          <Link
            href="/contacto"
            className="rounded-full border border-white/40 px-5 py-2 font-medium text-white transition-colors hover:border-vella-gold hover:text-vella-gold"
          >
            Contáctanos
          </Link>
        </nav>
        <p className="text-xs">
          © {new Date().getFullYear()} VellaTech. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
