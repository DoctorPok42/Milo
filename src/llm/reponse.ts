import { groq } from "..";

export const getGroqChat = async (message: string, systemPrompt: string) => {
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
    stream: true,
  });
};

export const getGroqChatWithSkillResponse = async (
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
    stream: true,
  });
};
