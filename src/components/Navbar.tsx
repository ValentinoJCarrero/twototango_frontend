import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logOut = () => {
    localStorage.removeItem("token");

    router.push("/iniciar-sesion");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="https://play-lh.googleusercontent.com/imEAd3PykpVSA6bRklnje-aDXeljJKHOJFICdhKJilJlJlWabxqWWtM04hE9Nnh3Bg=w240-h480-rw"
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-xl font-bold cursor-pointer">
            <Link href={"/"}>Tareini</Link>
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="focus:outline-none"
          >
            <Image
              src="https://i.pinimg.com/736x/3b/73/48/3b73483fa5af06e3ba35f4f71e541e7a.jpg"
              alt="Usuario"
              width={40}
              height={40}
              className="rounded-full"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <a
                onClick={logOut}
                href="/iniciar-sesion"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar sesión
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
