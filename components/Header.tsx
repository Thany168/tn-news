import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo.jpg";
import { AdSingleBanner } from "@/app/(public)/components/AdSingleBanner";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 shadow-sm">
      {/* Top bar */}
      <div className="bg-[#1E3A5F] px-6 h-10 flex items-center justify-between ">
        <div className="flex gap-5">
          <span className="text-[12px] text-[#90bef5]">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="text-[12px] text-[#90bef5]">Phnom Penh</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-[#90bef5]">Follow us</span>
          <a
            href="#"
            aria-label="Facebook"
            className="text-[#90bef5] hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="Telegram"
            className="text-[#90bef5] hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.5 4.5L2.5 11.5l6 2 2 6 3-4 5 4 3-15z" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="YouTube"
            className="text-[#90bef5] hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
              <polygon
                points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                fill="white"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b border-gray-100 px-6 overflow overflow-hidden object-cover">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between h-16 sticky top-0">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="w-14 h-14 rounded-sm bg-blue-500 flex items-center justify-center shrink-0">
              <Image src={logo} alt="Logo" width={200} height={100} priority />
            </div>
          </Link>

          <AdSingleBanner />
        </div>
      </div>
    </header>
  );
}
