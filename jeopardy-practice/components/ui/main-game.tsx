"use client";

import { Input } from "@/components/ui/input";
import { CollapsibleCard, MainCard } from "@/components/ui/question-card";
import { ScrollArea} from "@/components/ui/scroll-area";
import { useEffect, useState, useRef } from "react";

type Question = {
  year: number;
  value: number;
  category: string;
  clue: string;
  answer: string;
}

export function MainGame() {

    const [showAnswer, setShowAnswer] = useState(false);
    const defaultQuestion: Question ={
        year: 3030,
        value: 0,
        category: "Music",
        clue: "What is the best album of all time?",
        answer: "Loveless"
    };
    const [questions, setQuestions] = useState<Question[]>([defaultQuestion]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const currentQuestion = questions.at(-1);
    const pastQuestions = questions.slice(0, -1).reverse();


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement; 

            if (target.tagName === "INPUT") {
                return;
            }
            if (event.key === " ") {
                inputRef.current?.focus();
            }
            if (event.key === "j") {
                fetchQuestion();
                setShowAnswer(false);
            }
            if (event.key === "s") {
                setShowAnswer(true);
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown); 
    }, []);

    const fetchQuestion = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_RANDOM_API;
        const res = await fetch(`${apiUrl}`);
        if (!res.ok) {
            throw new Error("Failed to fetch clue");
        }
        const data = await res.json();

        const numeric = data.clue_value.replace(/\D/g, "");
        const newQuestion: Question = {
            year: parseInt(data.game_year, 10),
            value: numeric ? parseInt(numeric, 10) : 0,
            category: data.clue_category,
            clue: data.clue_question,
            answer: data.clue_answer
        };
        setQuestions(prev => [...prev, newQuestion]);
    }

    const checkAnswer = (event: React.FormEvent) => {
        event.preventDefault();
        const input = inputRef.current?.value.trim().toLowerCase();
        if (input) {
            // check answer

            if(inputRef.current) {
                inputRef.current.value = ""
            }
            setShowAnswer(true);
        }
        inputRef.current?.blur();
    };



    return (
        <div className="flex h-screen w-full px-8 py-8">
            <div className="flex flex-col flex-1 mx-auto gap-4 overflow-hidden">
                <MainCard 
                year={currentQuestion.year}
                value={currentQuestion.value}
                category={currentQuestion.category}
                clue={currentQuestion.clue}
                answer={currentQuestion.answer}
                showAnswer={showAnswer}
                />
                <form onSubmit={checkAnswer}>
                    <Input 
                        onMouseDown={(e) => e.preventDefault()}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                e.currentTarget.blur();
                            }
                         
                        }}
                        ref={inputRef} 
                        type="text" 
                        placeholder="Answer" 
                    />
                </form>

                <ScrollArea className="flex-1 h-0">
                <div className="flex flex-col gap-4 p-2">
                    {pastQuestions.map((question, index) => (
                        <CollapsibleCard
                            key={index}
                            year={question.year}
                            value={question.value}
                            category={question.category}
                            clue={question.clue}
                            answer={question.answer}
                        />
                    ))}
                </div>
                </ScrollArea>
            </div>
        </div>
  )
}