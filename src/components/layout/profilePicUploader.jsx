"use client";

import { useState, useEffect } from 'react';
import { storage, db } from '@/app/firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Buffer } from 'buffer'; // Add this import if Buffer is not defined

const ProfilePicUploader = ({ initialPicUrl }) => {
  const [picUrl, setPicUrl] = useState(initialPicUrl);
  const [isPicUrlPresent, setIsPicUrlPresent] = useState(false);
  const [hostelName, setHostelName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const encodedToken = localStorage.getItem("sys_bio");
      if (encodedToken) {
        const decodedToken = Buffer.from(encodedToken, "base64").toString("utf8");
        const fetched = JSON.parse(decodedToken);
        setHostelName(fetched.hostelName);
        setUserId(fetched.userId);
      }
    }
  }, []);

  useEffect(() => {
    const checkPicUrl = async () => {
      if (!userId) return;
      try {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          if (userData.picUrl) {
            setIsPicUrlPresent(true);
            setPicUrl(userData.picUrl);
          }
        }
      } catch (error) {
        console.error('Error checking picUrl:', error);
      }
    };

    checkPicUrl();
  }, [userId]);

  const handleButtonClick = () => {
    document.getElementById('profilepic-upload').click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    if (file.size > 500 * 1024) {
      alert("File size exceeds 500KB. Please upload a smaller file.");
      return;
    }

    try {
      console.log('Uploading file:', file);

      const storageRef = ref(storage, `ProfilePic/${userId}`);
      await uploadBytes(storageRef, file);
      console.log('File uploaded successfully');

      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL obtained:', downloadURL);

      const usersCollectionRef = collection(db, 'users');
      const q = query(usersCollectionRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const docRef = userDoc.ref;

        await updateDoc(docRef, { picUrl: downloadURL });
        console.log('Document successfully updated in users collection!');
      } else {
        console.log('No matching documents found in users collection.');
      }

      const hostelCollectionRef = collection(db, hostelName);
      const hostelQuery = query(hostelCollectionRef, where('userId', '==', userId));
      const hostelQuerySnapshot = await getDocs(hostelQuery);

      if (!hostelQuerySnapshot.empty) {
        const hostelDoc = hostelQuerySnapshot.docs[0];
        const hostelDocRef = hostelDoc.ref;

        await updateDoc(hostelDocRef, { picUrl: downloadURL });
        console.log(`Document successfully updated in ${hostelName} collection!`);
      } else {
        console.log(`No matching documents found in ${hostelName} collection.`);
      }

      setPicUrl(downloadURL);
      setIsPicUrlPresent(true);
      alert("Profile picture updated successfully.");
    } catch (error) {
      console.error('Error uploading file:', error);
      console.error('Error details:', error.code, error.message);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <input 
        type="file" 
        id="profilepic-upload" 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
      {!isPicUrlPresent && (
        <Button 
          id="profilepic" 
          className="text-sm mt-2" 
          onClick={handleButtonClick}
        >
          Change Picture
        </Button>
      )}
      {picUrl && (
        <div className="relative w-20 h-20 rounded-full overflow-hidden border shadow-lg">
          <Image
            id="profile-image"
            src={picUrl}
            alt="Profile"
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
    </div>  
  );
};

export default ProfilePicUploader;