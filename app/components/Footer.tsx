// components/Footer.tsx
import { FaYoutube, FaBlog } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t mt-16 py-8">
      <div className="flex justify-center gap-6">
        
        {/* YouTube */}
        <a
          href="https://www.youtube.com/@HitoriBIZ"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="HitoriBIZ YouTube"
          className="text-gray-500 hover:text-red-600 transition"
        >
          <FaYoutube size={28} />
        </a>

        {/* Blog */}
        <a
          href="https://www.hitoribiz-blog.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="HitoriBIZ Blog"
          className="text-gray-500 hover:text-blue-600 transition"
        >
          <FaBlog size={26} />
        </a>

      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        © 2026 HitoriBIZ. All rights reserved.
      </p>
    </footer>
  );
}
