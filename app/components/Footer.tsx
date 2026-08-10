// app/components/Footer.tsx
import Link from "next/link";
import { FaYoutube, FaBlog, FaLine } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <div className="flex justify-center gap-6">
        {/* YouTube */}
        <a
          href="https://www.youtube.com/@HitoriBIZ"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="HitoriBIZ YouTube"
          className="text-gray-500 transition hover:text-red-600"
        >
          <FaYoutube size={28} />
        </a>

        {/* Blog */}
        <a
          href="https://www.hitoribiz-blog.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="HitoriBIZ Blog"
          className="text-gray-500 transition hover:text-blue-600"
        >
          <FaBlog size={26} />
        </a>

        {/* LINE */}
        <a
          href="https://lin.ee/pnOnPKN"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="HitoriBIZ 公式LINE"
          className="text-gray-500 transition hover:text-green-600"
        >
          <FaLine size={28} />
        </a>
      </div>

      <div className="mt-5 flex justify-center">
        <Link
          href="/company"
          className="text-sm text-gray-500 transition hover:text-gray-800"
        >
          会社情報
        </Link>
      </div>

      <p className="mt-4 text-center text-xs text-gray-400">
        © 2026 HitoriBIZ. All rights reserved.
      </p>
    </footer>
  );
}