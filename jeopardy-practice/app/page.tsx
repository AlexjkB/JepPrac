"use client";
import { Sidebar, SidebarProvider,SidebarHeader, SidebarContent, SidebarGroup, SidebarInset } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { MainGame} from "@/components/ui/main-game"

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
  Guess = "guess"
}

const imageUrl: string = "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=400&titles=";
const summaryUrl: string = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=";


export default function Home() {

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          settings
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            price and year range preferences
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <MainGame />
      </SidebarInset>
      <Sidebar side="right">
        <SidebarHeader>
          wiki info
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            info to go here
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
