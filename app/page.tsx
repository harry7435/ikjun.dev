import Link from "next/link";

export default function Home() {
  return (
    <div className="flex">
      <nav className="w-64 p-4">
        <ul>
          <li>
            <Link href="/about" className="hover:text-gray-300">
              About
            </Link>
          </li>
        </ul>
      </nav>
      <main className="ml-64 p-4">{/* 메인 콘텐츠 */}</main>
    </div>
  );
}
