"use client";


// ===============================
// v0.0.1 — AI Content Engine (UI only)
// ===============================
// This version shows the layout only.
// Nothing is connected yet.


import { useState } from "react";


export default function Home() {
 // Controls whether message shows
 const [clicked, setClicked] = useState(false);


 // Runs when button is clicked
 const handleClick = () => {
   setClicked(true);
 };


 return (
   <main className="min-h-screen bg-black text-white flex items-center justify-center">
    
     <div className="w-full max-w-xl px-6 text-center">


       {/* App title */}
       <h1 className="text-3xl font-bold mb-4">
         AI Content Engine
       </h1>


       {/* Simple instruction */}
       <p className="text-gray-400 mb-8">
         Click the button to generate ideas
       </p>


       {/* Button */}
       <button
         onClick={handleClick}
         className="w-full p-3 bg-white text-black font-semibold rounded"
       >
         Generate Ideas
       </button>


       {/* Inline message after click */}
       {clicked && (
         <p className="mt-4 text-sm text-gray-400">
           Coming next — we’ll make this work
         </p>
       )}


       {/* Future results area */}
       <p className="mt-8 text-gray-500 text-sm">
         Ideas will show here after we update and add more logic
       </p>


     </div>
   </main>
 );
}
