import { db } from "@/app/firebase/firebaseConfig";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const QrCodeScanner = ({ setLastFiveScans }) => {
  const getMealTimeLabel = () => {
    const hours = new Date().getHours();
    if (hours >= 7 && hours < 9) return "BREAKFAST";
    if (hours >= 11 && hours < 15) return "LUNCH";
    return "DINNER";
  };

  const [Hostelname, setHostelName] = useState("");
  const [result, setResult] = useState("");
  const [bg, setBg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previousMealTime, setPreviousMealTime] = useState(getMealTimeLabel());

  const { toast } = useToast();
  let picUrl = "";
  let name = "";
  let hostelName = "";
  let claim;
  let claimBackgroundColor;

  useEffect(() => {
    const encodedToken = localStorage.getItem("sys_bio");
    const decodedToken = Buffer.from(encodedToken, "base64").toString("utf8");
    const fetched = JSON.parse(decodedToken);
    hostelName = fetched.hostelName;
    setHostelName(fetched.hostelName);

    fetchAttendanceCount();

    const unsubscribeAttendance = listenToAttendanceCount();

    return () => {
      unsubscribeAttendance();
    };
  }, []);

  useEffect(() => {
    if (scanCount > 0) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [scanCount]);

  useEffect(() => {
    const currentMealTime = getMealTimeLabel();
    if (previousMealTime !== currentMealTime) {
      setPreviousMealTime(currentMealTime);
    }
  }, [previousMealTime]);

  const fetchAttendanceCount = async () => {
    try {
      const hostelQuery = query(
        collection(db, "Hostels"),
        where("name", "==", hostelName)
      );
      const hostelSnapshot = await getDocs(hostelQuery);

      if (!hostelSnapshot.empty) {
        const hostelDoc = hostelSnapshot.docs[0];
        const data = hostelDoc.data();
        setAttendanceCount(data.attendanceCount || 0);
      } else {
        setInitialAttendanceCount();
      }
    } catch (error) {
      console.error("Error fetching attendance count:", error);
    }
  };

  const listenToAttendanceCount = () => {
    const hostelQuery = query(
      collection(db, "Hostels"),
      where("name", "==", hostelName)
    );

    const unsubscribe = onSnapshot(hostelQuery, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data();
        setAttendanceCount(data.attendanceCount || 0);
      });
    });

    return unsubscribe;
  };

  const setInitialAttendanceCount = async () => {
    try {
      const hostelQuery = query(
        collection(db, "Hostels"),
        where("name", "==", hostelName)
      );
      const hostelSnapshot = await getDocs(hostelQuery);

      if (!hostelSnapshot.empty) {
        const hostelDoc = hostelSnapshot.docs[0];
        await updateDoc(doc(db, "Hostels", hostelDoc.id), {
          attendanceCount: 0,
        });
      }
    } catch (error) {
      console.error("Error setting initial attendance count:", error);
    }
  };

  const updateAttendanceCount = async (newCount) => {
    try {
      const hostelQuery = query(
        collection(db, "Hostels"),
        where("name", "==", Hostelname)
      );
      const hostelSnapshot = await getDocs(hostelQuery);

      if (!hostelSnapshot.empty) {
        const hostelDoc = hostelSnapshot.docs[0];
        await updateDoc(doc(db, "Hostels", hostelDoc.id), {
          attendanceCount: newCount,
        });
      }
    } catch (error) {
      console.error("Error updating attendance count:", error);
    }
  };

  const handleScan = async (data) => {
    if (data && !isScanning) {
      setIsScanning(true);
      setScannedData(data.text);
      try {
        const Query = query(
          collection(db, hostelName),
          where("messnumber", "==", parseInt(data.text))
        );
        const Snapshot = await getDocs(Query);
        let paidStatus = false;
        let paidBackgroundColor = "";
        Snapshot.forEach((doc) => {
          const docData = doc.data();
          picUrl = docData.picUrl;
          name = docData.name;
          claim = docData.claim;
          claimBackgroundColor =
            claim == "Yes"
              ? "bg-green-100 border border-green-500 text-green-800 rounded-full px-4 py-1 text-center inline-block"
              : "bg-red-100 border border-red-500 text-red-800 rounded-full px-4 py-1 text-center inline-block";

          const currentDate = new Date();

          const previousMonthDate = new Date(
            currentDate.setMonth(currentDate.getMonth() - 1)
          );
          const previousMonth = previousMonthDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });

          const monthlyData = docData.monthlyData || [];
          const currentMonthData = monthlyData.find(
            (item) => item.month === previousMonth
          );

          if (currentMonthData) {
            paidStatus = currentMonthData.paid;
            paidBackgroundColor = paidStatus
              ? "bg-green-100 border border-green-500 text-green-800 rounded-full px-4 py-1 text-center inline-block"
              : "bg-red-100 border border-red-500 text-red-800 rounded-full px-4 py-1 text-center inline-block";
          }
        });

        toast({
          title: (
            <img
              src={picUrl}
              alt="Profile Picture"
              className="w-28 h-28 rounded-full mb-2 mt-2"
            />
          ),
          description: (
            <div>
              <p className="font-bold">Name: {name}</p>
              <p className="font-bold">Mess number: {data.text}</p>
              <p className={`font-bold mt-2 ${paidBackgroundColor}`}>
                {paidStatus ? "Paid" : "Not Paid"}
              </p>
              <p className={`font-bold mt-2 ml-2 ${claimBackgroundColor}`}>
                {claim == "Yes" ? "Yes" : "No"}
              </p>
            </div>
          ),
          action: (
            <ToastAction
              altText="Mark Attendance"
              className="bg-black text-white"
              onClick={() => markAttendance(data.text)}
            >
              Mark Attendance
            </ToastAction>
          ),
        });
      } catch (error) {
        console.error("Error fetching picUrl:", error);
      }
    }
  };

  const markAttendance = async (scannedData) => {
    setResult("");
    setBg("");

    setIsLoading(true);
    setScanCount((prevCount) => prevCount + 1);
    try {
      let docId = null;
      let collectionName = hostelName;
      let mon = false;
      let noon = false;
      let eve = false;
      let messDates = [];

      const Query = query(
        collection(db, hostelName),
        where("messnumber", "==", parseInt(scannedData))
      );
      const Snapshot = await getDocs(Query);
      Snapshot.forEach((doc) => {
        const data = doc.data();
        docId = doc.id;

        mon = data.mon;
        noon = data.noon;
        eve = data.eve;

        const currentMonth = new Date().toLocaleString("default", {
          month: "long",
        });
        const monthData = data.messcuts.find(
          (item) => item.messMonth === currentMonth
        );
        if (monthData) {
          messDates = monthData.messDates.map((date) => new Date(date));
        }
      });

      if (docId && collectionName) {
        const today = new Date();
        const todayDateString = today.toISOString().split("T")[0];
        const dateExists = messDates.some(
          (date) => date.toISOString().split("T")[0] === todayDateString
        );

        if (dateExists) {
          setBg("destructive");
          setResult("On MessCut");
        } else {
          const hours = today.getHours();
          let updateField = "";

          if (hours >= 7 && hours < 9) {
            if (mon) {
              setBg("destructive");
              setResult("Rejected");
            } else {
              setBg("success");
              setResult("Accepted");
              updateField = "mon";
            }
          } else if (hours >= 11 && hours < 14) {
            if (noon) {
              setBg("destructive");
              setResult("Rejected");
            } else {
              setBg("success");
              setResult("Accepted");
              updateField = "noon";
            }
          } else if (hours >= 19 && hours < 22) {
            if (eve) {
              setBg("destructive");
              setResult("Rejected");
            } else {
              setBg("success");
              setResult("Accepted");
              updateField = "eve";
            }
          } else {
            setBg("destructive");
            setResult("Invalid time period");
          }

          if (updateField) {
            setLastFiveScans((prevScans) => {
              const updatedScans = [
                { messNumber: scannedData, name },
                ...prevScans,
              ];

              return updatedScans.slice(0, 5);
            });
            await updateDoc(doc(db, collectionName, docId), {
              [updateField]: true,
            });
            setAttendanceCount((prevCount) => {
              const newCount = prevCount + 1;

              return newCount;
            });
          }
        }
      } else {
        setBg("destructive");
        setResult("Data not found");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setBg("destructive");
      setResult("Error marking attendance");
    } finally {
      setIsScanning(false);
      setIsLoading(false);

      const hostelQuery = query(
        collection(db, "Hostels"),
        where("name", "==", hostelName)
      );
      const hostelSnapshot = await getDocs(hostelQuery);

      if (!hostelSnapshot.empty) {
        const hostelDoc = hostelSnapshot.docs[0];
        const hostelDocRef = doc(db, "Hostels", hostelDoc.id);

        await updateDoc(hostelDocRef, {
          attendanceCount: increment(1),
        });

        console.log("Attendance count updated successfully!");
      } else {
        console.log("No matching hostel found.");
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setBg("destructive");
    setResult("Error scanning QR code");
  };

  const incrementAttendance = async () => {
    try {
      console.log("HOSTEL NAME:", Hostelname);
      const newCount = attendanceCount + 1;
      await updateAttendanceCount(newCount);
      setAttendanceCount(newCount);
    } catch (error) {
      console.error("Error incrementing attendance count:", error);
    }
  };

  const decrementAttendance = async () => {
    try {
      const newCount = Math.max(0, attendanceCount - 1);
      await updateAttendanceCount(newCount);
      setAttendanceCount(newCount);
    } catch (error) {
      console.error("Error decrementing attendance count:", error);
    }
  };

  return (
    <div className="p-4 w-full h-full flex flex-col items-center justify-center gap-2">
      <div className="w-full md:w-1/2 max-w-lg border-4 border-red-500 rounded-3xl px-4">
        <QrReader
          delay={300}
          onError={handleError}
          onResult={handleScan}
          className="w-full h-auto"
          constraints={{
            facingMode: { exact: "environment" },
            advanced: [{ zoom: 2.0 }],
          }}
        />
        {showAlert && (
          <Alert variant={bg}>
            <AlertTitle>{result}</AlertTitle>
          </Alert>
        )}
      </div>

      <div className="flex flex-col items-center">
        <Badge variant="outline" className="mb-1">
          {`TODAY'S ${getMealTimeLabel()} ATTENDANCE: ${attendanceCount}`}
        </Badge>
        <Button onClick={incrementAttendance} className="mt-1">
          +
        </Button>
      </div>
    </div>
  );
};

export default QrCodeScanner;