"use client"
import { App } from "./app";
import { ContextProvider } from "./ContextProvide/ContextProvider";
import { ChakraProvider } from '@chakra-ui/react'
export default function Home() {
  return (
    <main className="min-h-screen">
      <ContextProvider>
        <ChakraProvider>
 <App/>
        </ChakraProvider>
      </ContextProvider>   
     
    </main>
  );
}