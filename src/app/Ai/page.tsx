"use client"; // Ensure you're using client-side rendering
import { useState, useEffect, useRef } from "react";
import { HfInference } from "@huggingface/inference";
import DOMPurify from "dompurify";

const Aipage = () => {
  const [prompt, setPrompt] = useState<string>(""); // Stores user's input
  const [conversation, setConversation] = useState<string>(""); // Stores full conversation
  const [overflowStyle, setOverflowStyle] = useState<"hidden" | "auto">("hidden"); // Controls overflow
  const conversationRef = useRef<HTMLDivElement | null>(null); // Ref for conversation div

  const inference = new HfInference("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");

  // Fetch data from the bot
  const fetchData = async (prompt: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      let fullText = ""; // Variable to accumulate the full response

      for await (const chunk of inference.chatCompletionStream({
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      })) {
        const newText = chunk.choices[0]?.delta?.content || ""; // Get the new part of the text
        fullText += newText; // Accumulate the text
      }

      // Update conversation: include user's input and bot's response
      const newConversation = `
        <span class="text-green-600">User:</span> ${prompt}<br>
        <span class="text-yellow-400">Bot:</span> ${fullText}<br>
      `;

      // Sanitize the conversation before updating state
      setConversation((prev) => prev + DOMPurify.sanitize(newConversation));

      // Clear the prompt input after sending
      setPrompt("");
    } catch (error) {
      console.error("Error fetching the data:", error);
    }
  };

  // Check if content exceeds div height and update overflow style
  useEffect(() => {
    const conversationDiv = conversationRef.current;

    if (conversationDiv && conversationDiv.scrollHeight > conversationDiv.clientHeight) {
      setOverflowStyle("auto"); // Show scroll if content exceeds height
    } else {
      setOverflowStyle("hidden"); // Hide scroll if content fits
    }
  }, [conversation]);

  return (
    <section className="relative top-[100px]">
      <div className="grid place-items-center gap-10">
        <div
          ref={conversationRef} // Ref for the conversation div
          className="w-[1000px] h-[1000px]  p-4 bg-gray-800 text-white  shadow-xl rounded" // Fixed height and width
          style={{ overflowY: overflowStyle }} // Dynamic overflow based on content
        >
          {/* Render sanitized conversation */}
          <div dangerouslySetInnerHTML={{ __html: conversation }} />
        </div>
        <div >
          <form onSubmit={(e)=>fetchData(prompt,e)} className="flex gap-10">
          <input
            className="w-[880px] rounded bg-gray-700 text-white py-2 outline-none border-none"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          />
          <button
            className="bg-gray-700 px-[20px] rounded py-[10px] duration-[350ms] ease-in-out transition-all text-white hover:bg-white hover:text-gray-700"
            type="submit"
            
          >
            Send
          </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Aipage;
