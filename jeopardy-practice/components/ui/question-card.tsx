"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

type Question = {
  year: number;
  value: number;
  category: string;
  clue: string;
  answer: string;
}

export function CollapsibleCard({ year, value, category, clue, answer }: Question) {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Card className="w-full cursor-pointer select-none">
            <CardHeader className="space-y-2">
                <div className="flex items-center justify-between w-full">
                    <CardTitle>{year} / {value} / {category}</CardTitle>
                    <CardTitle>{answer}</CardTitle>
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
  return (
    <Card className="w-full cursor-pointer select-none">
        <CardHeader className="space-y-2">
            <div className="flex items-center justify-between w-full">
                <CardTitle>{year} / ${value} / {category}</CardTitle>
                {showAnswer && <CardTitle>{answer}</CardTitle>}
            </div>
            <CardDescription>
              {clue}
            </CardDescription>
        </CardHeader>
    </Card>
  )
}