//  All Requre Import
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Components/Sidebar";
import { UseContextValue } from "./ContextProvide/ContextProvider";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaPaperPlane } from "react-icons/fa6";
import { PiUploadSimple } from "react-icons/pi";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import TypingLoader from "./Components/ChatLoader";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "./lib/superbase/browser";
import { getCookie, SendHestory, UniqueId } from "./lib/utils";
import Cookies from "js-cookie";
import { FcGoogle } from "react-icons/fc";
// import {SendHestory} from "./Controller/controller.js"

export const App = () => {
  // All require Hooks
  const navigate = useRouter();
  const {
    isVisibleSidebar,
    toggleSidebar,
    setShowHistoryId,
    toggleSidebarBaseOnScreen,
  } = UseContextValue();
  const toast = useToast();
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState(null);
  const scrollRef = useRef(null);
  const [isAuth, setIsAuth] = useState(false);
  const [userName, seUserName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chatId, setChatId] = useState(null);
  const cancelRef = React.useRef();
  const [dummyData, setDummyData] = useState([]);
  const [copied, setCopied] = useState(false);

  const [arr, setArr] = useState("Hello upendra PAl");
  // Google Authentication
  const signInWithGoogle = async () => {
    console.log("hello world of supabase");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  useEffect(() => {
    setChatId(UniqueId());
  }, []);

  // Check Login User
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = getCookie("sb-vxysqlojrtxmdzgxcqda-auth-token.0");
      if (token) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) {
          console.error("Error getting user:", userError.message);
          return;
        }

        if (!user) {
        } else {
          const { aud, email } = user;
          if (aud) {
            setIsAuth(true);
            seUserName(email);
          }
        }
      }
    };

    fetchUserDetails();
  }, []);

  // Auto Scroll Down
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  // Dynamic Screen change
  // useEffect(() => {
  
  //   window.addEventListener("resize", () => {
  //     if (window.screen.width < 768) {
  //       toggleSidebarBaseOnScreen(false);
  //     } else {
  //       toggleSidebarBaseOnScreen(true);
  //     }
  //   });
  // }, [window&&window.screen.width]);

  useEffect(() => {
    const handleResize = () => {
      if (window.screen.width < 768) {
        toggleSidebarBaseOnScreen(false);
      } else {
        toggleSidebarBaseOnScreen(true);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      // Call the handler right away so state gets updated with initial window size
      handleResize();
      
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // API intrigation
  const handleFetchData = async (fileContent) => {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyCwxOKlmm0DRXGlpnxwtK6ee0wqGEnSUJc`,
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Please summarize the following content. Include the main points, key details,
                   and any important information and give me with proper formate. I have to show ot on react UI.
                  Content : ${inputValue + " " + fileContent}`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response?.data?.candidates[0].content?.parts[0].text;

      const newEntry = {
        question: inputValue || "your file aploaded",
        answer: result || "containt not found",
      };
      setData((prev) => [...prev.slice(0, -1), newEntry]);
      setFile(null);
      if (data.length == 0) {
        console.log(data);
      } else if (data.length == 1) {
        const SaveDatares = await SendHestory({
          data,
          userId: userName,
          chatId,
        });
      } else {
        const SaveDatares = await SendHestory({ data }, chatId);
      }
    } catch (error) {
      console.error("Error making request:", error);
      // res.status(500).send("Internal Server Error");
    }

    setInputValue("");
  };

  // Loged out the user
  const handleLogOut = () => {
    console.log("Log Out");
    Cookies.remove("sb-vxysqlojrtxmdzgxcqda-auth-token.0");
    setIsAuth(false);
    seUserName("");
    setData([]);
    setShowHistoryId([]);
  };

  // Upload file function
  const UploadFile = async () => {
    if (!isAuth) {
      onOpen();
      return;
    }
 

    const formData = new FormData();
    formData.append("file", file);
    const newEntry = {
      question: inputValue || "your file aploaded",
      answer: null,
    };
    setData((prev) => [...prev, newEntry]);
    if (file) {
      try {
        const response = await axios.post(
          "http://localhost:8080/chat/upload",
          formData
        );
        console.log(response);
        const formateData = response.data.split("");
        handleFetchData(response?.data || "");
      } catch (error) {
        console.log({ error });
      }
    } else {
      handleFetchData("");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: `Copy to clipboard`,
          status: "success",
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="bg-gradient-to-r from-gray-300 to-gray-400 min-h-screen flex items-center justify-between w-full overflow-hidden">
      <Sidebar userName={userName} data={data} />
      <div className="bg-black flex justify-between flex-col min-h-screen m-auto text-white rounded-lg md:w-[70%] w-[100%] p-0 overflow-hidden">
        <header className="bg-gray-900 rounded-t-lg p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full p-1 flex justify-center items-center">
              <GiHamburgerMenu
                onClick={toggleSidebar}
                className="font-bold text-[32px] cursor-pointer"
              />
            </div>
          </div>
          <div>
            <a href="/">
              <h1 className="font-bold text-[32px] cursor-pointer">
                DUNLIN-AI
              </h1>
            </a>
          </div>
          <div className="text-2xl cursor-pointer">
            {isAuth ? (
              <Button
                onClick={handleLogOut}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
                  onClick={onOpen}
                >
                  Login
                </Button>
                <AlertDialog
                  motionPreset="slideInBottom"
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                  isOpen={isOpen}
                  isCentered
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent className="w-full max-w-lg py-40 px-16 bg-white rounded-lg shadow-2xl">
                      <div>
                        <h2 className="text-lg font-semibold">
                          Login to Dunlin-AI
                        </h2>
                        <p className="mt-2 text-gray-600">
                          Sign in with your Google account to access the AI
                          platform.
                        </p>
                      </div>
                      <AlertDialogBody className="w-full h-[700px] flex flex-col justify-center items-center">
                        <Button
                          onClick={signInWithGoogle}
                          className="px-4 py-2 bg-red-500 flex items-center content-center gap-2 text-white rounded-lg shadow-md hover:bg-red-600"
                        >
                          <FcGoogle className="text-2xl" />
                          Login with Google
                        </Button>
                      </AlertDialogBody>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </>
            )}
          </div>
        </header>

        {data.length ? (
          <div
            ref={scrollRef}
            className="w-full h-full flex flex-col text-lg gap-2 overflow-y-auto max-h-[calc(100vh-200px)] p-8"
          >
            {data.map((question, index) => (
              <div
                key={index}
                className="mb-4 flex flex-col justify-between gap-4"
              >
                <h3
                  onClick={() => copyToClipboard(question.answer)}
                  className="w-[90%] cursor-pointer md:w-[70%] p-3 font-semibold text-lg"
                >
                  {question.question}
                </h3>
                {question.answer ? (
                  <div className="max-w-[90%]  md:max-w-[70%] self-end">
                    <span>Sumrised Answer : </span>

                    <p
                      onClick={() => copyToClipboard(question.answer)}
                      className="max-w-[100%] cursor-pointer p-3 rounded-lg text-black bg-gray-100 "
                      dangerouslySetInnerHTML={{ __html: question.answer }}
                    ></p>
                  </div>
                ) : (
                  <TypingLoader />
                )}
              </div>
            ))}
          </div>
        ) : (
          <ul className="flex flex-col items-center justify-center  text-lg gap-2 my-8 overflow-y-auto max-h-[calc(100vh-200px)] p-8">
            <p>Hey chat with dunlin ai</p>
          </ul>
        )}
        <div className="bg-black p-5 rounded-b-lg flex gap-4 items-end">
          <div className="flex-grow flex flex-col">
            <textarea
              required
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="p-2 bg-gray-900 text-white rounded-md outline-none resize-none overflow-auto"
              placeholder="Chat with dunlin ai"
              rows={
                inputValue.length <= 100
                  ? 1
                  : inputValue.length <= 200
                  ? 3
                  : inputValue.length <= 300
                  ? 5
                  : 8
              }
              style={{ minHeight: "40px", maxHeight: "200px" }}
            />

            <div className="mt-[-30px] mr-1 flex font-semibold  self-end">
              <label className="rounded-lg px-2 py-1 cursor-pointe transition duration-300">
                <PiUploadSimple
                  className={`cursor-pointer rounded-lg ${
                    file ? "text-green-600" : "text-gray-300"
                  }`}
                  size={20}
                />
                <input
                  disabled={file}
                  type="file"
                  accept=".txt, .html, .docs, .html, .pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>

              <button
                onClick={UploadFile}
                className={`${
                  inputValue ? "bg-green-500" : "bg-slate-400"
                } mr-1 text-black px-4 py-1 font-semibold rounded-xl cursor-pointer self-end`}
              >
                <FaPaperPlane />
              </button>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
