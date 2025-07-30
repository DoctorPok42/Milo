import { config } from "dotenv";
import { readFileSync } from "fs";
import Groq from "groq-sdk";
import core from "./core/core";
import getSkills from "./core/getSkills";
import { Skills } from "./types";
import { prompt } from "enquirer";
import { createSpinner } from "nanospinner";
import makeResponse from "./llm/reponse";

config({ quiet: true }); // Load environment variables from .env file

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  throw new Error("GROQ_API_KEY is not set in the environment variables.");
}

export const groq = new Groq({ apiKey });

// Load system prompt and skills
const systemPrompt = readFileSync("./src/core/prompt.md", "utf-8");
const skills: Skills[] = getSkills();

const startMilo = async () => {
  console.log("Milo is ready to assist you!");

  while (true) {
    const userInput = (await prompt({
      type: "input",
      name: "userMessage",
      message: "You: ",
    }).then((response) => response)) as { userMessage: string };

    if (!userInput || userInput.userMessage.trim() === "") {
      console.log("Exiting...");
      break;
    }

    try {
      if (userInput.userMessage.trim().toLowerCase() === "exit") {
        console.log("Exiting...");
        break;
      }

      const spinner = createSpinner("Processing your request...").start();

      // Process the user input with the core function
      const responses = (await core({
        userMessage: userInput.userMessage,
        skills,
      })) as string | null;

      // Ask the LLM to generate a response based on the responses and skills
      const llmResponse = await makeResponse({
        userRequest: userInput.userMessage,
        response: responses,
        systemPrompt,
      });

      spinner.clear();
      spinner.stop();

      console.info(
        "\x1b[1;34mMilo's response:\x1b[0m",
        llmResponse || "No response from Milo."
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

startMilo();
