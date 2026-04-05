export const convertSkillsToString = (skills: string[]) => {
  let concatenatedSkills = "";
  for (let skill of skills) {
    concatenatedSkills += `${skill} `;
  }
  return concatenatedSkills;
};

export const convertSkillsToArray = (skills: string) => {
  return skills.split(" ");
};
