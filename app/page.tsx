"use client";


// ===============================
// v1.0.0 — AI Content Engine (first API connection)
// ===============================
// This version:
// - fetches credits on page load
// - sends a structured prompt to the backend API
// - updates credits after each request
// - uses YOUR hosted backend (not local API)
// ===============================


import { useState, useEffect } from "react";
import { userId } from "@/lib/student-id";


export default function Home() {
 // ===============================
 // STATE
 // ===============================


 // Stores AI-generated ideas
 const [ideas, setIdeas] = useState<string | null>(null);


 // Loading state (disables button + shows feedback)
 const [loading, setLoading] = useState(false);


 // Credits remaining (fetched from backend)
 const [credits, setCredits] = useState<number | null>(null);


 // ===============================
 // CONFIG
 // ===============================


 // Base URL for YOUR backend (this is where requests are sent)
 const BASE_URL = "https://lkn-ai-backend.vercel.app";


 // Student ID: set once in lib/student-id.ts


 // ===============================
 // FETCH CREDITS ON PAGE LOAD
 // ===============================
 useEffect(() => {
   const fetchCredits = async () => {
     try {
       const res = await fetch(`${BASE_URL}/api/credits?userId=${userId}`);
       const data = await res.json();


       // If request fails, default to 0 credits
       if (!res.ok) {
         setCredits(0);
         return;
       }


       // Set credits from backend response
       setCredits(data.credits ?? 0);
     } catch (err) {
       console.error("Failed to fetch credits");
     }
   };


   fetchCredits();
 }, [userId]);


 // ===============================
 // GENERATE CONTENT IDEAS
 // ===============================
 const handleClick = async () => {
   // Prevent request if no credits
   if (credits === null || credits <= 0) return;


   setLoading(true);


   try {
     // Prompt sent to AI model
     const prompt = `
YOUR TASK:
Generate 3 TikTok content ideas about FC Barcelona transfer rumours.


REQUIREMENTS:
- Target FC Barcelona fans
- Focus on relatable, real-life scenarios
- Each idea must:
 - Start with a strong hook
 - Include a clear scenario
 - Be emotionally engaging


FORMAT:
- Numbered list
- 1–2 sentences per idea
`;


     // Send request to YOUR backend (not OpenAI directly)
     const res = await fetch(`${BASE_URL}/api/generate`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         prompt,
         userId,
       }),
     });


     // Handle no credits edge case (sync UI with backend)
     if (res.status === 403) {
       const creditRes = await fetch(`${BASE_URL}/api/credits?userId=${userId}`);
       const creditData = await creditRes.json();


       setCredits(creditData.credits);
       setIdeas("No credits remaining.");
       setLoading(false);
       return;
     }


     const data = await res.json();


     // Clean formatting (remove markdown artifacts)
     const cleanIdeas = (data?.ideas || "").replace(/\*\*/g, "");


     // Update UI with results
     setIdeas(cleanIdeas);
     setCredits(data.creditsRemaining);


   } catch (err) {
     setIdeas("Error generating ideas.");
   }


   setLoading(false);
 };


 // ===============================
 // UI
 // ===============================
 return (
   <main className="min-h-screen bg-black text-white flex items-center justify-center">
     <div className="w-full max-w-xl px-6 text-center">


       {/* Header with credits */}
       <div className="flex justify-between items-center mb-4">
         <h1 className="text-3xl font-bold">
           AI Content Engine
         </h1>
         <span className="text-sm text-gray-400">
           {credits !== null ? `${credits}/50` : "--/50"}
         </span>
       </div>


       {/* Instruction */}
       <p className="text-gray-400 mb-8">
         Click the button to generate ideas
       </p>


       {/* Generate Button */}
       <button
         onClick={handleClick}
         disabled={loading || credits === null || credits <= 0}
         className={`w-full p-3 font-semibold rounded ${
           loading || credits === null || credits <= 0
             ? "bg-gray-700 text-gray-400 cursor-not-allowed"
             : "bg-white text-black"
         }`}
       >
         {loading ? "Generating..." : "Generate Ideas"}
       </button>


       {/* Output area */}
       <div className="mt-8 text-left text-sm text-gray-300 whitespace-pre-wrap">
         {ideas ? ideas : "Ideas will show here..."}
       </div>


     </div>
   </main>
 );
}