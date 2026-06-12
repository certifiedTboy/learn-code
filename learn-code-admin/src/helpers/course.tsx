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

export const isAtLeast31DaysAgo = (dateInput: string) => {
  const inputDate: Date = new Date(dateInput);
  const now: Date = new Date();

  const diffInMs = now.getTime() - inputDate.getTime();
  const daysDiff = diffInMs / (1000 * 60 * 60 * 24);

  return daysDiff <= 31;
};
