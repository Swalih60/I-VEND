"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Img from "../../../public/images/Img.webp";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth, provider, signInWithPopup, db } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";


const Page = ({ email }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: email || '',
  });
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const checkUserExists = async (email) => {
    if (email) {
      try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setUserExists(true);
          router.push('/');
        } else {
          setUserExists(false);
        }
      } catch (error) {
        console.error('Error checking user existence:', error);
      }
    }
  };


  useEffect(() => {
    if (email) {
      checkUserExists(email);
    }
  }, [email, router]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };


  const addDataToFirestore = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User must be signed in to submit the form');
        return;
      }


      const docRef = collection(db, 'users');
      await addDoc(docRef, {
        ...formData,
        userId: user.uid,
      });

      console.log('Form data stored successfully');
    } catch (error) {
      console.error('Error storing form data:', error);
    }
  };



  const handleSelectChange = (id, value) => {
    setFormData((prevData) => {
      let newFormData = { ...prevData, [id]: value };

      return newFormData;
    });
  };

  const isFormValid = () => {
    const requiredFields = ['name', 'phoneNumber', 'email'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Missing field: ${field}`);
        return false;
      }
     
    }
    return true;
  };




  const handleSubmit = async (e) => {
    if (isFormValid()) {
      toast({
        title: "Registration successful",
        description: "You have been successfully registered.",
        className: "bg-green-500 text-white",
        status: "success",
        duration: 1800,
      });
    }


    e.preventDefault();
    if (isFormValid()) {  //&&  isBranchValid()
      setIsLoading(true); // Set loading state to true
      console.log('Form Data:', formData);
      try {
        await addDataToFirestore();
        setFormData({
          name: '',
          phoneNumber: '',
          email: email || '',
        });
        router.push('/'); // Navigate to the loading page
      } catch (error) {
        console.error("Error during form submission:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after operation completes
      }
    } else {
      alert('Please fill out all fields.');
    }
  };



  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setFormData((prevData) => ({
        ...prevData,
        email: user.email || '',
      }));
      checkUserExists(user.email);
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };

  return (

    <div className="h-screen w-screen flex justify-center items-center">
      {userExists || formData.email ? (
        <>
          <form onSubmit={handleSubmit}>
            <Card className="max-w-md w-full p-4 mx-4 space-y-4">
              <CardHeader>
                <CardTitle>Registration Form</CardTitle>
                <CardDescription>
                  Please fill in the form below to register.
                </CardDescription>
              </CardHeader>

              <CardContent>

                <div className="my-4">
                  <label>Email</label>
                  <Input
                    className=" w-full px-4 py-2 border border-gray-300 rounded-md"
                    id="email"
                    placeholder="email"
                    value={formData.email}
                    required
                    readOnly
                  />
                </div>

                {/* name */}
                <div className="my-4">
                  <label>Name</label>
                  <Input
                    className=" w-full px-4 py-2 border border-gray-300 rounded-md"
                    id="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                


                {/* phone number */}
                <div className="my-4">
                  <label className="block  mb-1">Phone Number</label>
                  <Input
                    className=" w-full px-4 py-2 border border-gray-300 rounded-md"
                    id="phoneNumber"
                    type="tel" maxLength={10}
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 10); // Limit to 10 digits
                      handleChange({ target: { id: "phoneNumber", value } });
                    }}
                    onInput={(e) => e.target.value = e.target.value.slice(0, 10)} // Another layer of protection
                    required
                  />
                </div>

                <div className="my-4">
                  <Button
                    className={`w-full py-2 px-4 flex items-center justify-center ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-300 hover:bg-yellow-500'
                      } text-black`}
                    type="submit"
                    disabled={isLoading}>
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <Button onClick={handleGoogleSignIn} className="mt-5 py-2 px-4 rounded mb-1 flex items-center">
              <Image
                src={Img}
                alt="Google"
                className="w-5 h-5 mr-2" // Adjust size as needed
              />
              <span>Sign up with Google</span>
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};
export default Page;