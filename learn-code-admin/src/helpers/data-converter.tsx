type SubTopic = {
  title: string;
  contentURI: string;
  isVideo: boolean;
};

type CourseContent = {
  mainTopic: string;
  description: string;
  subTopics: SubTopic[];
};

type CourseReference = {
  name: string;
  description: string;
  price: number;
  totalTopics: number;
  requiredDuration: number;
  image: string;
  skills: string[];
  contents: CourseContent[];
};

export function convertCourseTextToReference(rawText: string): CourseReference {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Valid course text is required");
  }

  const text = rawText
    .replace(/N\s*a\s*m\s*e\s*:/gi, "Name:")
    .replace(/D\s*e\s*s\s*c\s*r\s*i\s*p\s*t\s*i\s*o\s*n\s*:/gi, "Description:")
    .replace(/P\s*r\s*i\s*c\s*e\s*:/gi, "Price:")
    .replace(
      /T\s*o\s*t\s*a\s*l\s*T\s*o\s*p\s*i\s*c\s*s\s*:/gi,
      "Total Topics:",
    )
    .replace(
      /R\s*e\s*q\s*u\s*i\s*r\s*e\s*d\s+D\s*u\s*r\s*a\s*t\s*i\s*o\s*n\s*s?\s*:/gi,
      "Required Durations:",
    )
    .replace(/I\s*m\s*a\s*g\s*e\s*:/gi, "Image:")
    .replace(/S\s*k\s*i\s*l\s*l\s*s\s*:/gi, "Skills:")
    .replace(/M\s*a\s*i\s*n\s+T\s*o\s*p\s*i\s*c/gi, "Main Topic")
    .replace(/T\s*i\s*t\s*l\s*e\s*:?/gi, "Title:")
    .replace(/T\s*o\s*p\s*i\s*c\s*:/gi, "Topic:")
    .replace(
      /C\s*o\s*n\s*t\s*e\s*n\s*t\s+U\s*R\s*I\s*:/gi,
      "Content URI:",
    )
    .replace(
      /C\s*o\s*n\s*t\s*e\s*n\s*t\s+U\s*R\s*L\s*:/gi,
      "Content URL:",
    )
    .replace(/I\s*s\s*V\s*i\s*d\s*e\s*o\s*:/gi, "Is Video:")
    .replace(/t\s*r\s*u\s*e/gi, "true")
    .replace(/f\s*a\s*l\s*s\s*e/gi, "false")
    .replace(/\s+/g, " ")
    .trim();

  const extractValue = (label: string, nextLabels: string[]): string => {
    const nextPattern = nextLabels.join("|");
    const match = text.match(
      new RegExp(`${label}\\s*:\\s*(.*?)\\s*(?=${nextPattern}|$)`, "i"),
    );

    return match?.[1]?.trim() ?? "";
  };

  const nameAndDescription = extractValue("Name", [
    "Description\\s*:",
    "Price\\s*:",
  ]);
  const explicitDescription = extractValue("Description", ["Price\\s*:"]);
  const repeatedName = nameAndDescription.match(
    /^(.+?)\s+\1\s+(?:is|covers|provides|introduces)\b/i,
  );
  const inferredName = repeatedName?.[1]?.trim() ?? "";
  const name = explicitDescription
    ? nameAndDescription
    : inferredName;
  const description =
    explicitDescription ||
    (repeatedName ? nameAndDescription.slice(name.length).trim() : "");

  const parseNumber = (label: string, nextLabel: string): number => {
    const value = extractValue(label, [`${nextLabel}\\s*:`]).replace(
      /[^0-9.-]/g,
      "",
    );
    const parsed = Number(value);

    if (!value || !Number.isFinite(parsed)) {
      throw new Error(`Could not read ${label.toLowerCase()} from the PDF`);
    }

    return parsed;
  };

  const price = parseNumber("Price", "Total Topics");
  const totalTopics = parseNumber("Total Topics", "Required Durations");
  const requiredDuration = parseNumber("Required Durations", "Image");
  const image = extractValue("Image", ["Skills\\s*:"])
    .replace(/\s+/g, "")
    .replace(/[.,;]+$/, "");
  const skillsText = extractValue("Skills", ["Main\\s+Topic"])
    .replace(/\.$/, "")
    .trim();
  const skills = skillsText
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  if (!name) {
    throw new Error("Could not read the course name from the PDF");
  }

  if (!description) {
    throw new Error("Could not read the course description from the PDF");
  }

  const curriculumHeader = text.match(
    /Main\s+Topic\s+Description\s+Subtopics/i,
  );

  if (!curriculumHeader || curriculumHeader.index === undefined) {
    throw new Error("Could not find curriculum sections in the PDF");
  }

  const curriculumStart =
    curriculumHeader.index + curriculumHeader[0].length;
  const curriculumText = text.slice(curriculumStart);
  const descriptionStarts = [
    ...curriculumText.matchAll(/\bLearn\s+(?:the|how)\b/gi),
  ];
  const videoLabels = [
    ...curriculumText.matchAll(/Is\s*Video\s*:\s*(?:true|false)/gi),
  ];

  const sections = descriptionStarts.map((descriptionStart, index) => {
    const descriptionIndex = descriptionStart.index;

    if (descriptionIndex === undefined) {
      throw new Error("Could not locate a curriculum section in the PDF");
    }

    const precedingVideo = videoLabels
      .filter((videoLabel) => (videoLabel.index ?? 0) < descriptionIndex)
      .at(-1);
    const sectionStart =
      index === 0
        ? 0
        : (precedingVideo?.index ?? -1) +
          (precedingVideo?.[0].length ?? 0);

    if (sectionStart < 0) {
      throw new Error("Could not determine a curriculum section boundary");
    }

    const descriptionEndMatch = curriculumText
      .slice(descriptionIndex)
      .match(/\b(?:Title|Topic)\s*:/i);

    if (!descriptionEndMatch || descriptionEndMatch.index === undefined) {
      throw new Error("Could not find lessons for a curriculum section");
    }

    const sectionEnd = sectionsEnd(descriptionStarts, index, curriculumText);
    const sectionBlock = curriculumText.slice(sectionStart, sectionEnd);
    const mainTopic = sectionBlock
      .slice(0, descriptionIndex - sectionStart)
      .trim();
    const description = curriculumText
      .slice(
        descriptionIndex,
        descriptionIndex + descriptionEndMatch.index,
      )
      .trim();
    const subTopics: SubTopic[] = [];
    const subTopicPattern =
      /(?:Title|Topic)\s*:\s*(.*?)\s*Content\s*(?:URI|URL)\s*:\s*(.*?)(?:\s*Is\s*Video\s*:\s*(true|false))?(?=\s*(?:Title|Topic)\s*:|$)/gi;

    for (const match of sectionBlock.matchAll(subTopicPattern)) {
      const title = match[1].trim();
      const contentURI = match[2].replace(/\s+/g, "").replace(/[.,;]+$/, "");

      if (!title || !contentURI) continue;

      subTopics.push({
        title,
        contentURI,
        isVideo: match[3]?.toLowerCase() === "true",
      });
    }

    if (!mainTopic || !description || subTopics.length === 0) {
      throw new Error("Could not completely read a curriculum section from the PDF");
    }

    return { mainTopic, description, subTopics };
  });

  if (sections.length === 0) {
    throw new Error("No curriculum sections were found in the PDF");
  }

  return {
    name,
    description,
    price,
    totalTopics,
    requiredDuration,
    image,
    skills,
    contents: sections,
  };
}

function sectionsEnd(
  descriptionStarts: RegExpMatchArray[],
  currentIndex: number,
  curriculumText: string,
): number {
  const nextDescription = descriptionStarts[currentIndex + 1];

  if (!nextDescription || nextDescription.index === undefined) {
    return curriculumText.length;
  }

  const precedingVideo = [
    ...curriculumText
      .slice(0, nextDescription.index)
      .matchAll(/Is\s*Video\s*:\s*(?:true|false)/gi),
  ].at(-1);

  if (!precedingVideo || precedingVideo.index === undefined) {
    throw new Error("Could not determine a curriculum section boundary");
  }

  return precedingVideo.index + precedingVideo[0].length;
}
