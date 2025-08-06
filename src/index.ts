import { config } from "dotenv";
import { readFileSync } from "fs";
import Groq from "groq-sdk";
import core from "./core/core";
import getSkills from "./core/getSkills";
import { Skills } from "./types";
import { prompt } from "enquirer";
import { createSpinner } from "nanospinner";
import { getGroqChat, getGroqChatWithSkillResponse } from "./llm/reponse";

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

    let spinner;

    try {
      if (userInput.userMessage.trim().toLowerCase() === "exit") {
        console.log("Exiting...");
        break;
      }

      spinner = createSpinner("Processing your request...").start();

      // Process the user input with the core function
      const responses = ((await core({
        userMessage: userInput.userMessage,
        skills,
      })) as unknown) as string | null;

      // Ask the LLM to generate a response based on the responses and skills
      let llmResponse;

      if (responses === "null") {
        llmResponse = await getGroqChat(userInput.userMessage, systemPrompt);
      } else if (responses) {
        llmResponse = await getGroqChatWithSkillResponse(
          userInput.userMessage,
          responses,
          systemPrompt
        );
      }

      spinner.clear();
      spinner.stop();

      process.stdout.write("\x1b[1;34mMilo's response:\x1b[0m ");

      // Stream the response from the LLM
      for await (const message of llmResponse as AsyncIterable<any>) {
        const content = message.choices[0]?.delta?.content;
        if (!content || content.trim() === "") continue;

        process.stdout.write(content);
      }

      process.stdout.write("\n");

    } catch (error) {
      spinner?.clear();
      spinner?.stop();
      console.error(
        "\x1b[1;31mAn error occurred while processing your request.\x1b[0m",
        error instanceof Error ? error.message : "Unknown error"
      );
      process.stdout.write("\n");
    }
  }
};

startMilo();
