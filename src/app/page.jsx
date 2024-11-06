"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Img from "../../public/images/Img.webp";
import { auth, db, provider, signInWithPopup } from "./firebase/firebaseConfig";
import LoadingSpinner from "../components/loading/page.jsx";
import SplashScreen from "../components/splashscreen/page.jsx";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Handle initial splash screen
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // Show splash for 3 seconds initially

    return () => clearTimeout(timer);
  }, []);

  const checkUserExists = async (email) => {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      } else {
        toast({
          variant: "destructive",
          title: "Account Not Found",
          description: "User is not registered. Please sign up.",
          action: (
            <Button variant="link" asChild>
              <Link href="/register">Register</Link>
            </Button>
          ),
        });
        return null;
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while checking user existence.",
      });
      return null;
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDetails = await checkUserExists(user.email);

      if (userDetails) {
        // Show splash screen before redirecting
        setShowSplash(true);
        // Wait for splash animation before redirecting
        setTimeout(() => {
          router.push("/user");
        }, 3000);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      toast({
        variant: "destructive",
        title: "Sign-In Error",
        description: "An error occurred during sign-in. Please try again.",
      });
      setIsLoading(false);
    }
  };

  // Show splash screen if showSplash is true
  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {isLoading && !showSplash && <LoadingSpinner />}
      {!isLoading && (
        <Card className="max-w-md w-full p-4 mx-4 space-y-4">
          <CardHeader>
            <CardTitle>i-VEND</CardTitle>
            <CardDescription>Login to i-VEND</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="py-2 px-4 flex items-center justify-center w-full mb-4"
              onClick={handleGoogleSignIn}
            >
              <Image src={Img} alt="Google" className="w-5 h-5 mr-2" />
              <span>Login with Google</span>
            </Button>
            <p className="flex justify-center">
              Not a User?
              <Link href="/register" className="ml-1 text-blue-500">
                Signup
              </Link>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;