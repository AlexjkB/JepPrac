"use client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { LeftSidebar } from "@/components/ui/left-sidebar";
import { RightSidebar } from "@/components/ui/right-sidebar";
import { useEffect, useState, useRef } from "react";
import { MainGame } from "@/components/ui/main-game"

type Question = {
  year: number;
  value: number;
  category: string;
  clue: string;
  answer: string;
}

enum State {
  Question = "question",
  Answer = "answer",
  Answered = "answered"
}

const defaultQuestion: Question = {
  year: 3030,
  value: 0,
  category: "Music",
  clue: "What is the best album of all time?",
  answer: "Loveless"
};


const articles: string[] = ["a", "an", "the"]

const equivalenceList: string[][] = [
  ["zero", "zeroeth", "zeroth", "0"],
  ["one", "first", "i", "1", "1st"],
  ["two", "second", "ii", "2", "2nd"],
  ["three", "third", "iii", "turd", "3", "3rd"],
  ["four", "forth", "fourth", "iv", "4", "4th"],
  ["fifth", "five", "5", "5th", "v", "versus", "vs", "against"],
  ["sixth", "six", "vi", "emacs", "6", "6th"],
  ["seventh", "seven", "vii", "7", "7th"],
  ["eight", "eighth", "8", "viii", "iix", "8th"],
  ["nine", "nein", "ninth", "ix", "9", "9th"],
  ["ten", "tenth", "10", "10th", "x", "by", "times", "product", "multiplied", "multiply"],
  ["eleventh", "eleven", "xi", "11th"],
  ["twelfth", "twelveth", "twelve", "12", "xii", "12th"],
  ["thirteenth", "thirteen", "13", "xiii", "13th"],
  ["fourteenth", "fourteen", "ixv", "14th"],
  ["fifteenth", "fifteen", "15", "xv", "15th"],
  ["sixteenth", "sixteen", "16", "xvi", "16th"],
  ["seventeenth", "seventeen", "17", "xvii", "17th"],
  ["eighteenth", "eighteen", "eightteen", "18", "xviii", "18th"],
  ["nineteenth", "ninteenth", "ninteen", "nineteen", "19", "ixx", "19th"],
  ["twentieth", "twenty", "xx", "20", "20th"],
  ["thirtieth", "thirty", "xxx", "30", "30th"],
  ["hundred", "c", "100", "100th"],
  ["dr", "doctor", "drive"],
  ["mr", "mister"],
  ["ms", "miss", "mrs"],
  ["st", "saint", "street"],
  ["rd", "road"],
  ["albert", "al"],
  ["robert", "bob", "rob"],
  ["william", "will", "bill"],
  ["richard", "rich", "dick"],
  ["jim", "james"],
  ["gregory", "greg"],
  ["christopher", "chris"],
  ["benjamin", "ben"],
  ["nicholas", "nick"],
  ["anthony", "tony"],
  ["lawrence", "larry"],
  ["edward", "edvard", "edouard", "ed"],
  ["kim", "kimball"],
  ["vladimir", "vlad"],
  ["vic", "victor"],
  ["samuel", "samantha", "sam"],
  ["log", "logarithm"],
  ["constant", "number"],
];

const equivalenceMap: Record<string, string[]> = {};

for (const group of equivalenceList) {
  for (const item of group) {
    const groupNoRepeat = group.filter(i => i !== item);
    equivalenceMap[item] = groupNoRepeat;
  }
}

function combinations<T>(arr: T[], r: number): T[][] {
  if (r === 0) return [[]];
  if (arr.length < r) return [];

  const result: T[][] = [];
  for (let i = 0; i <= arr.length - r; i++) {
    const head = arr[i];
    const tailCombs = combinations(arr.slice(i + 1), r - 1);
    for (const tail of tailCombs) {
      result.push([head, ...tail]);
    }
  }
  return result;
}

function getAllCombinations(inputList: string[], equivalenceMap: Record<string, string[]>): string[] {
  const allLists: string[][] = [inputList];

  for (const word of inputList) {
    if (word in equivalenceMap) {
      for (const equivalent of equivalenceMap[word]) {
        const copyList = [...inputList];
        const idx = inputList.indexOf(word);
        if (idx !== -1) {
          copyList[idx] = equivalent;
          allLists.push(copyList);
        }
      }
    }
  }

  const allCombinationsSet = new Set<string>();

  for (const list of allLists) {
    const combo: string[] = [];
    for (let r = 0; r <= list.length; r++) {
      const combs = combinations(list, r);
      for (const comb of combs) {
        combo.push(comb.join(""));
      }
    }

    const nonEmpty = combo.filter(str => str.length > 0);

    for (const str of nonEmpty) {
      allCombinationsSet.add(str);
    }
  }

  return Array.from(allCombinationsSet);
}

function processString(text: string, articles: string[]): string[] {
  text = text
    .split("")
    .filter(char => /[a-zA-Z0-9 ]/.test(char))
    .join("");
  text = text.toLowerCase();
  text = text.replace(/\s+/g, " ").trim();
  const textList = text.split(" ");
  const filtered = textList.filter(word => !articles.includes(word));

  return filtered;
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[m][n];
}

function levenshteinRatio(s1: string, s2: string): number {
  if (!s1 && !s2) return 1;
  const distance = levenshteinDistance(s1, s2);
  const sum = s1.length + s2.length;
  return (sum - distance) / sum;
}

function maxLevenshtein(answerOptions: string[], guess: string): number {
  let maxLevenshteinRatio = 0.0;

  for (const option of answerOptions) {
    const ratio = levenshteinRatio(option, guess);
    if (ratio > maxLevenshteinRatio) {
      maxLevenshteinRatio = ratio;
    }
  }

  return maxLevenshteinRatio;
}


export default function Home() {

  const [showAnswer, setShowAnswer] = useState(false);
  const [state, setState] = useState(State.Question);
  const [questions, setQuestions] = useState<Question[]>([defaultQuestion]);
  const [title, setTitle] = useState<string>("Wikipedia");
  const [totalWrong, setTotalWrong] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalSkipped, setTotalSkipped] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);


  const checkAnswer = (event: React.FormEvent) => {
    event.preventDefault();
    const input = inputRef.current?.value.trim().toLowerCase();
    if (input) {
      const working_answer = getAllCombinations(processString(questions.at(-1)!.answer, articles), equivalenceMap);
      const working_input = processString(input, articles).join("");

      if (maxLevenshtein(working_answer, working_input) > 0.9) {
        setTotalCorrect(prev => prev + 1);
        setTotalScore(prev => prev + questions.at(-1).value);
      } else {
        setTotalWrong(prev => prev + 1);
        setTotalScore(prev => prev - questions.at(-1).value);
      }

      if (inputRef.current) {
        inputRef.current.value = ""
      }
      setShowAnswer(true);
      setState(State.Answered);
    }
    inputRef.current?.blur();
    setTitle(questions.at(-1).answer ? questions.at(-1).answer : "");
  };

  const fetchQuestion = async () => {
    const res = await fetch(`api/question`);
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      if (target.tagName === "INPUT") {
        return;
      }
      if (event.key === " ") {
        if (state === State.Question) {
          inputRef.current?.focus();
        }
      }
      if (event.key === "j") {
        if (state !== State.Answered) {
          setTotalSkipped(prev => prev + 1);
        }
        fetchQuestion();
        setState(State.Question);
        setShowAnswer(false);
      }
      if (event.key === "s") {
        setState(State.Answer);
        setShowAnswer(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (showAnswer) {
      const last = questions.at(-1);
      setTitle(last ? last.answer : "");
    }
  }, [showAnswer, questions]);

  return (
    <SidebarProvider>
      <LeftSidebar
        totalScore={totalScore}
        totalCorrect={totalCorrect}
        totalWrong={totalWrong}
        totalSkipped={totalSkipped}
      />
      <SidebarInset className="mr-32">
        <MainGame
          questions={questions}
          showAnswer={showAnswer}
          inputRef={inputRef}
          checkAnswer={checkAnswer}
          state={state}
          onPastCardAnswerClick={(q) => setTitle(q.answer)}
        />
      </SidebarInset>
      <RightSidebar
        title={title}
      />
    </SidebarProvider>
  );
}
