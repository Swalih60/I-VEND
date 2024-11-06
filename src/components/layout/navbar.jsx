
"use client";

import { Button } from "@/components/ui/button";
import {
  ChartNoAxesCombined,
  IndianRupee,
  LogOut,
  Scissors,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const userLogout = async () => {
    localStorage.removeItem("sys_bio");
    fetch("/api/logout", {
      method: "GET",
    })
    .then(()=>{
      router.push("/")
    })
    .catch((err)=>{
      console.log(err)
    })
  };

  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <div className="flex items-start justify-between w-full h-full gap-2">
        <div className="flex flex-col justify-center items-center gap-1">
          <Link href="/user">
            <Button className="w-32 h-10 flex  items-center justify-center ">
              {" "}
              <User className="w-5 h-5 mx-1" />
              Profile
            </Button>
          </Link>
          <Link href="/user/messcut">
            <Button className="w-32 h-10 flex  items-center justify-center">
              {" "}
              <Scissors className="w-5 h-5 mx-1" />
              Mess Cut
            </Button>{" "}
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center gap-1">
          <Link href="/user/dashboard">
            <Button className="w-32 h-10 flex  items-center justify-center">
              {" "}
              <ChartNoAxesCombined className="w-5 h-5 mx-1" />
              Dashboard
            </Button>{" "}
          </Link>
          <Link href="/user/paybill">
            <Button className="w-32 h-10 flex  items-center justify-center ">
              {" "}
              <IndianRupee className="w-5 h-5 mx-1" />
              Pay Bill
            </Button>
          </Link>
        </div>
      </div>{" "}
      {/* <Link href="/"> */}
        <Button onClick={userLogout} className="w-72 h-10 bg-red-400">
          <LogOut className="w-5 h-5 mx-1" />
          LogOut
        </Button>{" "}
      {/* </Link> */}
    </div>
  );
};

export default Navbar;