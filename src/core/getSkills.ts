import { readdirSync } from "fs";
import { join } from "path";
import { Skills } from "../types";

const getSkills = (): Skills[] => {
  const skillsDir = join(__dirname, "../skills");
  const skills: Skills[] = [];

  readdirSync(skillsDir).forEach((file) => {
    if (!file.endsWith(".js")) return;

    const skill = require(`${skillsDir}/${file}`).default;
    const params = require(`${skillsDir}/${file}`).params;

    skills.push({
      name: params.name,
      description: params.description,
      tags: params.tags,
      execute: skill,
      args: [],
    });
  });

  return skills;
};

export default getSkills;
