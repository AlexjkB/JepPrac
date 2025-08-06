"use client"; import { Input } from "@/components/ui/input";
import { CollapsibleCard, MainCard } from "@/components/ui/question-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { State } from "@/types/shared-states";
import { Progress } from "@/components/ui/progress";

type Question = {
    year: number;
    value: number;
    category: string;
    clue: string;
    answer: string;
}


type MainGameProps = {
    questions: Question[];
    showAnswer: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    checkAnswer: (event: React.FormEvent) => void;
    state: State;
    onPastCardAnswerClick: (question: Question) => void;
    progress: number;
    setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MainGame({ questions, showAnswer, inputRef, checkAnswer, state, onPastCardAnswerClick, progress, setShowAnswer }: MainGameProps) {

    const currentQuestion = questions.at(-1)!;
    const pastQuestions = questions.slice(0, -1).reverse();


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
                <form onSubmit={checkAnswer} className="flex gap-2">
                    <Input
                        className="flex-1"
                        onMouseDown={(e) => {
                            if (state === State.Answered) {
                                e.preventDefault()
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                const form = e.currentTarget.form;
                                if (form) form.requestSubmit();
                                e.currentTarget.blur();
                                setShowAnswer(true);
                            }

                        }}
                        ref={inputRef}
                        type="text"
                        placeholder="Answer"
                    />
                    <button
                        type="submit"
                        className=" rounded-md px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        disabled={state != State.Answer}
                    >
                        Submit
                    </button>
                </form>

                <Progress value={progress} />

                <ScrollArea className="flex-1 h-0">
                    <div className="flex flex-col gap-4 pr-4 ">

                        {pastQuestions.map((question, index) => (
                            <CollapsibleCard
                                key={`${question.year}-${question.value}-${index}`} 
                                year={question.year}
                                value={question.value}
                                category={question.category}
                                clue={question.clue}
                                answer={question.answer}
                                onAnswerClick={() => onPastCardAnswerClick(question)}
                            />
                        ))}

                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}