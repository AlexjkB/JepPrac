"use client"; import { Input } from "@/components/ui/input";
import { CollapsibleCard, MainCard } from "@/components/ui/question-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { State } from "@/types/shared-states";

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
}

export function MainGame({ questions, showAnswer, inputRef, checkAnswer, state, onPastCardAnswerClick }: MainGameProps) {

    const currentQuestion = questions.at(-1);
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
                <form onSubmit={checkAnswer}>
                    <Input
                        onMouseDown={(e) => {
                            if (state === State.Answer) {
                                e.preventDefault()
                            }
                        }}
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
                    <div className="flex flex-col gap-4 pr-4">

                        {pastQuestions.map((question, index) => (
                            <CollapsibleCard
                                key={`${question.year}-${question.value}-${index}`} // unique key
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