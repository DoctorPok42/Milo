import { groq } from "../index";
import { Skills } from "../types";

async function detectSkillWithLLM(userRequest: string, skills: Skills[]) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "tool",
          tool_call_id: "skill_list",
          content: JSON.stringify(skills),
        },
        {
          role: "system",
          content: `You are an intelligent assistant tasked with understanding user requests and matching them to an appropriate Skill from the provided list.\
              Your task:\
              1. When identifying a Skill, always use its exact name as listed above, case-sensitive (e.g., "weather", not "Weather" or "Météo").\
              2. If you find additional arguments in the user request, include them in the response (e.g., "weather", ["Paris"]).\
              3. You have access to the last two messages exchanged between the user and the assistant to help you make a decision (see "last_two_messages").\
              4. If one or more matching Skills exist, respond ONLY like this:\
              {\
                "skills": [\
                  {\
                    "name": "Skill1",\
                    "args": ["arg1", "arg2", ...]\
                  },\
                  ...\
                ]\
              }\
              like a JSON object.\
              If no Skill matches, respond with: "null".\
              `,
        },
        {
          role: "user",
          content: userRequest,
        },
      ],

      model: "llama-3.3-70b-versatile",
    });

    if (!response.choices[0].message.content) return "null";

    return Object.assign({}, JSON.parse(response.choices[0].message.content));
  } catch (error) {
    console.error("Error during LLM request:", error);
    return "Error during Skill detection.";
  }
}

export default detectSkillWithLLM;
