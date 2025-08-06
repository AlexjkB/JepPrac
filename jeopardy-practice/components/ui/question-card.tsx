"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import { motion, AnimatePresence } from "framer-motion";

type Question = {
  year: number;
  value: number;
  category: string;
  clue: string;
  answer: string;
}

type CollapsibleCardProps = Question & {
  onAnswerClick: () => void;
}

export function CollapsibleCard({ year, value, category, clue, answer, onAnswerClick }: CollapsibleCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Card className="w-full cursor-pointer select-none">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between w-full">
              <CardTitle>{year} / ${value} / {category}</CardTitle>
              <CardTitle >
                <button
                  type="button"
                  className="cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnswerClick?.();
                  }}
                >
                  {answer}
                </button>
              </CardTitle>
            </div>
            {open && (
              <CardDescription>
                {clue}
              </CardDescription>
            )}
          </CardHeader>
        </Card>
      </CollapsibleTrigger>
    </Collapsible>
  )
}

type MainCardProps = Question & {
  showAnswer: boolean;
}

export function MainCard({ year, value, category, clue, answer, showAnswer }: MainCardProps) {
  const questionKey = `${year}-${value}-${category}-${clue}`;

  return (
    <Card className="w-full select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={questionKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between w-full">
              <CardTitle>
                {year} / ${value} / {category}
              </CardTitle>

              <AnimatePresence mode="wait">
                {showAnswer && (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardTitle>{answer}</CardTitle>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <CardDescription>
              {clue}
            </CardDescription>
          </CardHeader>
        </motion.div>
      </AnimatePresence>
    </Card>
  )
}