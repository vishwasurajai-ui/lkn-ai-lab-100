"use client";


// ===============================
// v2.0.0 — AI Content Engine (dynamic inputs + guards)
// ===============================
// This version:
// - lets users customize inputs (platform, topic, style, length)
// - builds dynamic prompts
// - fetches credits from backend
// - sends requests to YOUR hosted API
// - displays model + token usage
// ===============================


import { useState, useEffect } from "react";
import { userId } from "@/lib/student-id";


export default function Home() {
 // ===============================
 // STATE
 // ===============================


 const [ideas, setIdeas] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 const [credits, setCredits] = useState<number | null>(null);
 const [model, setModel] = useState<string | null>(null);
 const [usage, setUsage] = useState<any>(null);
 const [error, setError] = useState<string | null>(null);


 // User inputs
 const [platform, setPlatform] = useState("TikTok");
 const [topic, setTopic] = useState("");
 const [style, setStyle] = useState("Storytelling");
 const [length, setLength] = useState("1–2 sentences");


 // ===============================
 // CONFIG
 // ===============================


 // Your backend API (handles OpenAI + database)
 const BASE_URL = "https://lkn-ai-backend.vercel.app";


 // Student ID: set once in lib/student-id.ts


 // ===============================
 // LENGTH MAPPING (UI → PROMPT)
 // ===============================


 // Converts dropdown selections into AI instructions
 const LENGTH_MAP: Record<string, string> = {
   "1–2 sentences": "Each idea must be 1–2 sentences. Concise and punchy.",
   "3-4 sentences": "Each idea must be 3–4 sentences. Include more detail.",
   "Short punchy": "Each idea must be max 10–15 words. No filler.",
 };


 // ===============================
 // FETCH CREDITS ON PAGE LOAD
 // ===============================


 useEffect(() => {
   const fetchCredits = async () => {
     try {
       const res = await fetch(`${BASE_URL}/api/credits?userId=${userId}`);
       const data = await res.json();


       // Default to 0 if request fails
       setCredits(res.ok ? (data.credits ?? 0) : 0);
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
   // Guards (prevent bad requests)
   if (!platform) { setIdeas("Select a platform."); return; }
   if (!topic.trim()) { setIdeas("Enter a topic."); return; }
   if (!style) { setIdeas("Select a style."); return; }
   if (!length) { setIdeas("Select a length."); return; }
   if (credits === null || credits <= 0) { setIdeas("No credits left."); return; }


   setLoading(true);
   setModel(null);
   setError(null);


   try {
     // Build dynamic prompt based on user inputs
     const prompt = `
YOUR TASK:
Generate 3 content ideas for ${platform} about ${topic}.


REQUIREMENTS:
- Target beginners
- Style: ${style}
- Be specific, avoid generic ideas
- Each idea: strong hook + clear scenario + emotional


Length:
- ${LENGTH_MAP[length]}


PROHIBITIONS:
- Do NOT use brackets []
- Do NOT use labels like "Hook:" or "Scenario:"
- Do NOT use markdown (**)
- Write naturally like real content ideas


Format:
- Each idea must start with 1., 2., 3.
- Put each idea on its own line
- Do not add extra commentary before or after
`;


     // Send request to YOUR backend
     const res = await fetch(`${BASE_URL}/api/generate`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ prompt, userId }),
     });


     // Handle API errors cleanly
     if (!res.ok) {
       const errData = await res.json().catch(() => ({}));
       setError(errData.error || "Something went wrong.");
       setLoading(false);
       return;
     }


     const data = await res.json();


     // Clean formatting
     const cleanIdeas = (data?.ideas || "").replace(/\*\*/g, "");


     // Update UI
     setIdeas(cleanIdeas);
     setCredits(data.creditsRemaining);
     setModel(data.model?.replace(/-\d{4}-\d{2}-\d{2}$/, ""));
     setUsage(data.usage);


   } catch (err) {
     setError("Something went wrong. Please try again.");
   }


   setLoading(false);
 };


 // ===============================
 // UI
 // ===============================


 return (
   <>
     <main className="min-h-screen bg-black text-white flex items-center justify-center">
       <div className="w-full max-w-xl px-6">


         {/* Header */}
         <div className="flex justify-between items-center mb-6">
           <h1 className="text-3xl font-bold">AI Content Engine</h1>
           <span className="text-sm text-gray-400">
             {credits !== null ? `${credits}/50` : "--/50"}
           </span>
         </div>


         <p className="text-gray-400 mb-6 text-sm">
           Customize your content ideas
         </p>


         {/* Inputs */}
         <div className="flex flex-col gap-3 mb-6">
           <select value={platform} onChange={(e) => {
             if (loading) return;
             setPlatform(e.target.value);
             setIdeas(null);
             setModel(null);
           }} className="p-3 rounded-lg bg-gray-900 border border-white/10">
             <option>TikTok</option>
             <option>Instagram</option>
             <option>YouTube</option>
             <option>Snapchat</option>
           </select>


           <input value={topic} onChange={(e) => {
             if (loading) return;
             setTopic(e.target.value);
             setIdeas(null);
             setModel(null);
           }} placeholder="Enter a topic (e.g. basketball)"
             className="p-3 rounded-lg bg-gray-900 border border-white/10"
           />


           <select value={style} onChange={(e) => {
             if (loading) return;
             setStyle(e.target.value);
             setIdeas(null);
             setModel(null);
           }} className="p-3 rounded-lg bg-gray-900 border border-white/10">
             <option>Humorous</option>
             <option>Educational</option>
             <option>Storytelling</option>
           </select>


           <select value={length} onChange={(e) => {
             if (loading) return;
             setLength(e.target.value);
             setIdeas(null);
             setModel(null);
           }} className="p-3 rounded-lg bg-gray-900 border border-white/10">
             <option>1–2 sentences</option>
             <option>3-4 sentences</option>
             <option>Short punchy</option>
           </select>
         </div>


         {/* Button */}
         <button
           onClick={handleClick}
           disabled={loading || credits === null || credits <= 0}
           className={`w-full p-3 font-semibold rounded-lg transition ${
             loading || credits === null || credits <= 0
               ? "bg-gray-700 text-gray-400 cursor-not-allowed"
               : "bg-white text-black hover:opacity-90"
           }`}
         >
           {loading ? "Generating..." : "Generate Ideas"}
         </button>


         {/* Output */}
         <div className="mt-8">
           <div className="bg-gray-950 border border-white/10 rounded-xl p-5 min-h-[120px]">
             {ideas ? (
               <div className="space-y-3">
                 {ideas.split(/\n?\s*\d+[\.\-\):]\s*/).filter(Boolean).map((item, index) => (
                   <div key={index} className="border-b border-white/5 pb-3 last:border-none">
                     <div className="text-white text-lg leading-7">
                       {index + 1}. {item.trim()}
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-gray-500 text-sm">
                 Ideas will show here...
               </div>
             )}
           </div>


           <div className="flex justify-between mt-2 text-xs text-gray-500">
             <div>
               {usage ? (
                 <span>
                   tokens: {usage.prompt_tokens} in / {usage.completion_tokens} out
                 </span>
               ) : (
                 <span>tokens: —</span>
               )}
             </div>
             <div>
               model: {model || "—"}
             </div>
           </div>
         </div>
       </div>
     </main>


     {/* Error Modal */}
     {error && (
       <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
         <div className="bg-gray-900 border border-white/10 rounded-xl p-6 max-w-sm w-full text-center">
           <p className="text-white text-sm mb-4">{error}</p>
           <button onClick={() => setError(null)} className="bg-white text-black px-4 py-2 rounded">
             Close
           </button>
         </div>
       </div>
     )}
   </>
 );
}