import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { quotes } from '../data/QuotePanel';

const QuoteCard = () => {
    const [currentQuote, setCurrentQuote] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length);
        }, 7000);
    
        return () => clearInterval(interval);
    }, []);
    
  return (
       <div className="hidden md:flex md:w-1/2 bg-gray-200 p-10 flex-col justify-between text-black">
    
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img
          src="/logo.svg"
          alt="Planora"
          className="h-10 w-10"
        />

        <div>
           <h2 className="text-2xl font-bold tracking-tight">
             Planora
           </h2>

           <p className="text-sm text-gray-500">
              Write. Share. Inspire.
            </p>
        </div>
    </div>
    
      {/* Quote */}
      <div  key={currentQuote} className="space-y-6 animate-slide-up">
        <blockquote className="text-4xl font-bold leading-relaxed">
          "{quotes[currentQuote].text}"
        </blockquote>
    
        <p className="text-lg text-gray-800/80 italic">
          — {quotes[currentQuote].author}
        </p>
      </div>
    
      {/* Dots */}
      <div className="flex gap-2">
        {quotes.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentQuote === index
                ? "w-8 bg-gray-600"
                : "w-2 bg-gray-600/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default QuoteCard