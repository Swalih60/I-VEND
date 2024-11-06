"use client";

import { React, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, auth } from '../../../app/firebase/firebaseConfig';
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import pic from "../../../../public/images/adminProfile.webp"
import Image from "next/image";

const Navbar = () => {
  const [menuopen, setMenuOpen] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const router = useRouter();






  const toggleMenu = () => {
    setMenuOpen(!menuopen);
  };

  const Logout = async () => {
    localStorage.removeItem("sys_bio");
    fetch("/api/logout", {
      method: "GET",
    })
      .then(() => {
        router.push("/")
      })
      .catch((err) => {
        console.log(err)
      })
  };

  useEffect(() => {
    const currentDate = new Date();
    const day = currentDate.getDate();

    // Check if the current day is between 25 and 31
    if (day >= 25 && day <= 31) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, []);

  return (
    <div className="bg-black w-full text-gray-400 flex h-16 p-4 justify-between">
      {/* Right */}
      <div className="h-full flex items-center md:flex md:w-1/3 md:justify-start">
        <Avatar>
        <Image src={pic} alt="Admin Profile" layout="fill" objectFit="cover" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      {/* Center */}
      <div className="hidden md:flex md:w-1/3 md:h-full md:justify-center md:items-center md:gap-5">
        <Button>
          <Link href="/superadmin">Home</Link>
        </Button>
        <Button>
          <Link href="/superadmin/usermanagment">User Management</Link>
        </Button>

        <Button>
          <Link href="/superadmin/billgeneration">Bill Generation</Link>
        </Button>
        <Button>
          <Link href="/superadmin/supercuts">Super Cuts</Link>
        </Button>
      </div>


      <div className="hidden md:flex md:w-1/3 md:h-full md:justify-end md:items-center">
        <Button
          onClick={Logout}
          variant="destructive"
        >
          <LogOut className="w-5 h-5 mx-1" />
          LogOut
        </Button>
      </div>


      {/* Hamburger menu for small devices */}
      <div className="flex md:hidden items-center">
        <button
          className="text-gray-400 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuopen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuopen && (
        <div className="md:hidden absolute z-10 top-16 left-0 w-full bg-black text-gray-400 flex flex-col items-center gap-4 p-4">
          <Button className="w-36">
            <Link href="/superadmin">Home</Link>
          </Button>
          <Button className="w-36">
            <Link href="/superadmin/usermanagment">User Management</Link>
          </Button>
          <Button className="w-36">
            <Link href="/superadmin/billgeneration">Bill Generation</Link>
          </Button>
          <Button className="w-36">
            <Link href="/superadmin/supercuts">Super Cuts</Link>
          </Button>
          <Button
           variant="destructive"
           className="w-36"
           >
          Log Out
        </Button>
        </div>
  )
}
    </div >
  );
};

export default Navbar;
