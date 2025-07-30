import { groq } from "..";
import { Skills } from "../types";

interface ResponseProps {
  userRequest: string;
  response: string | null;
  systemPrompt: string;
}

const makeResponse = async ({
  userRequest,
  response,
  systemPrompt,
}: ResponseProps) => {
  if (response === "null") {
    const groqResponse = await getGroqChat(userRequest, systemPrompt);

    return groqResponse.choices[0].message.content;
  } else if (response) {
    const groqResponse = await getGroqChatWithSkillResponse(
      userRequest,
      response,
      systemPrompt
    );

    return groqResponse.choices[0].message.content;
  }
};

export default makeResponse;

const getGroqChat = async (message: string, systemPrompt: string) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: message,
      },
    ],

    model: "llama-3.3-70b-versatile",
    // stream: true,
  });
};

const getGroqChatWithSkillResponse = async (
  message: string,
  response: any,
  systemPrompt: string
) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "tool",
        tool_call_id: "skill_response",
        content: JSON.stringify(response),
      },
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: message,
      },
    ],

    model: "llama-3.3-70b-versatile",
    // stream: true,
  });
};
