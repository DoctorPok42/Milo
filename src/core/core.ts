import { Skills } from "../types";
import detectSkillWithLLM from "./decisions";

interface coreProps {
  userMessage: string;
  skills: Skills[];
}

const core = async ({ userMessage, skills }: coreProps) => {
  // "decisions" is the result of the LLM decision-making process of matching the user message to the appropriate skills.
  const decisions = (await detectSkillWithLLM(userMessage, skills)) as {
    skills: Skills[];
  };

  if (!decisions.skills) return { responses: "null", table: [] };

  const table = await decisions.skills.map((decision) => {
    const skill = skills.find((s) => s.name === decision.name);
    return {
      ...skill,
      args: decision.args as string[],
    };
  });

  if (!table.length) return { responses: "null", table: [] };
  const responses =
    (await table[0]) && table[0].execute
      ? await table[0].execute(table[0].args)
      : "null";

  return await { responses, table };
};

export default core;
