import { FaFacebook, FaYoutube, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import logo from "../public/logo.jpg";
const socials = [
  {
    href: "https://www.facebook.com/Thany404/",
    label: "Facebook",
    icon: <FaFacebook />,
  },
  {
    href: "#",
    label: "Twitter/X",
    icon: <FaXTwitter />,
  },
  {
    href: "#",
    label: "YouTube",
    icon: <FaYoutube />,
  },
  {
    href: "#",
    label: "Telegram",
    icon: <FaTelegram />,
  },
];
export default function Footer() {
  return (
    <footer
      style={{ background: "#1E3A5F" }}
      className="text-[#e8f0fb] px-10 pt-12 pb-6 font-sans"
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-9 border-b border-white/15">
          {/* Brand */}
          <div>
            <div className="w-14 h-14  bg-blue-500 flex items-center justify-center shrink-0">
              <Image src={logo} alt="Logo" width={200} height={100} priority />
            </div>

            <p className="text-sm text-[#90bef5] leading-relaxed mb-5 max-w-[220px]">
              Breaking news and in-depth reporting from Cambodia and around the
              world.
            </p>

            {/* Social links */}
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#90bef5] border border-[#1E90FF]/40 bg-[#1E90FF]/20 hover:bg-[#1E90FF]/45 hover:text-white transition-colors text-xl"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="text-[11px] font-medium tracking-widest text-[#1E90FF] uppercase mb-4">
              Categories
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                "Business",
                "Technology",
                "Politics",
                "Sports",
                "Entertainment",
                "Lifestyle",
              ].map((c) => (
                <a
                  key={c}
                  //   href={`/category/${c.toLowerCase()}`}
                  href="#"
                  className="text-sm text-[#c5d9f2] hover:text-white hover:underline"
                >
                  {c}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="text-[11px] font-medium tracking-widest text-[#1E90FF] uppercase mb-4">
              Company
            </div>

            <div className="flex flex-col gap-2.5">
              {["About us", "Our team", "Advertise", "Careers", "Contact"].map(
                (l) => (
                  <a
                    key={l}
                    href="#"
                    className="text-sm text-[#c5d9f2] hover:text-white hover:underline"
                  >
                    {l}
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="text-[11px] font-medium tracking-widest text-[#1E90FF] uppercase mb-4">
              Subscribe
            </div>

            <p className="text-sm text-[#c5d9f2] leading-relaxed mb-3">
              Get the latest news delivered to your inbox daily.
            </p>

            <input
              type="email"
              placeholder="your@email.com"
              className="w-full mb-2 bg-white/10 border border-[#1E90FF]/40 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#6a90bf] outline-none focus:border-[#1E90FF]"
            />

            <button className="w-full bg-[#1E90FF] hover:bg-[#1a7de0] transition-colors text-white text-sm font-medium py-2 rounded-lg">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 pt-5">
          <span className="text-sm text-[#6a90bf]">
            © {new Date().getFullYear()} TN News. All rights reserved.{" "}
            <span className="inline-block bg-[#1E90FF]/18 border border-[#1E90FF]/35 rounded px-2 py-0.5 text-[11px] text-[#90bef5] ml-1 align-middle">
              Powered by TN News
            </span>
          </span>

          <div className="flex gap-5">
            {["Privacy policy", "Terms of use", "Cookie settings"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm text-[#6a90bf] hover:text-white hover:underline"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
