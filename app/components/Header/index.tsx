import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <header className="w-full px-4 py-3 sticky top-0 bg-white border-b header z-50">
      <div className="w-full flex max-w-screen-xl mx-auto justify-between items-center">
        <Link
          to={"/"}
          className="text-3xl font-raleway font-bold tracking-wide"
        >
          Coolify
        </Link>
        <nav className="flex items-center gap-x-2.5 md:gap-x-4 font-semibold tracking-wide">
          <Link to={"/prompt"}>Prompt</Link>
          <div className="bg-gray-600 w-[2px] h-6" />
          <Link to={"/resume"}>Resume</Link>
          <div className="bg-gray-600 w-[2px] h-6" />
          <Link to={"/letter"}>Cover Letter</Link>
        </nav>
      </div>
    </header>
  );
}
