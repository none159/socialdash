"use client";
import { useState } from "react";
import InputEmoji from "react-input-emoji";


const Post = ({text, setText}:any) => {
 

  function handleEmojiChange(emoji: string) {
    setText((prevText :any) => prevText + emoji); 
  }

  function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value); 
  }

  return (
    <section className="p-10">
      <form className="flex flex-col items-center gap-[10px]">
        <textarea
          value={text} // Display main text with emojis
          autoComplete="off"
          onChange={handleTextChange}
          placeholder="Post Whatever You Like"
          className="w-full h-32 bg-gray-600 rounded border-none outline-none shadow-black shadow-sm"
        />
        <div className="flex align-middle items-center gap-[70px]">
          <InputEmoji
            value="" // Clear emoji input after adding it to main text
            onChange={handleEmojiChange}
            cleanOnEnter
            shouldConvertEmojiToImage={false} shouldReturn={false}          />
          <label htmlFor="file-upload" className="cursor-pointer bg-gray-600 p-[10px] rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="hover:text-gray-800 duration-[350ms]"
              viewBox="0 0 24 24"
            >
              <path d="M12 0l-8 8h5v8h6v-8h5l-8-8zm0 22a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8-2H4v-6h16v6z" />
            </svg>
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,video/*,application/pdf"
              className="hidden"
            />
          </label>
          <button

            className="bg-gray-600 text-white py-[10px] px-[50px] rounded duration-[350ms] ease-in-out hover:bg-white hover:text-gray-600"
          >
            Post
          </button>
        </div>
      </form>
    </section>
  );
};

export default Post;
