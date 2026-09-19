import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo-vellatech.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  linkTo?: string;
}

const heightClasses = {
  sm: "h-9",
  md: "h-14",
  lg: "h-20",
};

export function Logo({ size = "md", linkTo = "/" }: LogoProps) {
  return (
    <Link href={linkTo}>
      <Image
        src={logo}
        alt="VellaTech"
        className={`${heightClasses[size]} w-auto`}
        priority
      />
    </Link>
  );
}
