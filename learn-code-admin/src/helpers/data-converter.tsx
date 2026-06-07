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

  const normalizeText = (text: string): string => {
    return text
      .replace(/\s+/g, " ")
      .replace(/N\s*ame\s*:/gi, "Name:")
      .replace(/D\s*escription\s*:/gi, "Description:")
      .replace(/P\s*rice\s*:/gi, "Price:")
      .replace(/Total\s*Topics\s*:/gi, "Total Topics:")
      .replace(/R\s*equired\s*D\s*urations\s*:/gi, "Required Durations:")
      .replace(/I\s*mage\s*:/gi, "Image:")
      .replace(/S\s*kills\s*:/gi, "Skills:")
      .replace(/Tit\s*le\s*:/gi, "Title:")
      .replace(/Content\s*URI\s*:/gi, "Content URI:")
      .replace(/Is\s*Video\s*:/gi, "Is Video:")
      .replace(/https\s*:\s*\/\//gi, "https://")
      .replace(/\s*-\s*/g, "-")
      .trim();
  };

  const text = normalizeText(rawText);

  const extractValue = (label: string, nextLabels: string[] = []): string => {
    const nextPattern = nextLabels.length ? `(?=${nextLabels.join("|")})` : "$";

    const regex = new RegExp(`${label}\\s*:\\s*(.*?)\\s*${nextPattern}`, "i");

    const match = text.match(regex);

    return match ? match[1].trim() : "";
  };

  const name = extractValue("Name", ["Description\\s*:"]);

  const description = extractValue("Description", ["Price\\s*:"]);

  const price = Number(extractValue("Price", ["Total Topics\\s*:"])) || 0;

  const totalTopics =
    Number(extractValue("Total Topics", ["Required Durations\\s*:"])) || 0;

  const requiredDuration =
    Number(extractValue("Required Durations", ["Image\\s*:"])) || 0;

  const image = extractValue("Image", ["Skills\\s*:"]);

  const skillsText = extractValue("Skills", ["Main Topic"]);

  const skills = skillsText
    .replace(/\.$/, "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const courseReference: CourseReference = {
    name,
    description,
    price,
    totalTopics,
    requiredDuration,
    image,
    skills,
    contents: [],
  };

  const mainContent = text.split(/Main Topic\s+Description\s+Subtopics/i)[1];

  if (!mainContent) {
    return courseReference;
  }

  const knownMainTopics = [
    "Introduction to Software Development",
    "CSS Introduction",
    "Version Control System",
    "JavaScript Introduction",
  ];

  const contents: CourseContent[] = [];

  for (let i = 0; i < knownMainTopics.length; i++) {
    const currentTopic = knownMainTopics[i];
    const nextTopic = knownMainTopics[i + 1];

    const startIndex = mainContent.indexOf(currentTopic);

    if (startIndex === -1) continue;

    const endIndex =
      nextTopic && mainContent.indexOf(nextTopic) !== -1
        ? mainContent.indexOf(nextTopic)
        : mainContent.length;

    const topicBlock = mainContent.slice(startIndex, endIndex).trim();

    const withoutTopic = topicBlock.replace(currentTopic, "").trim();

    const firstTitleIndex = withoutTopic.search(/Title\s*:/i);

    const topicDescription =
      firstTitleIndex !== -1
        ? withoutTopic.slice(0, firstTitleIndex).trim()
        : withoutTopic;

    const subtopicBlock =
      firstTitleIndex !== -1 ? withoutTopic.slice(firstTitleIndex).trim() : "";

    const subTopics: SubTopic[] = [];

    const subTopicRegex =
      /Title\s*:\s*(.*?)\s*Content URI\s*:\s*(.*?)\s*Is Video\s*:\s*(true|false)/gi;

    let match: RegExpExecArray | null;

    while ((match = subTopicRegex.exec(subtopicBlock)) !== null) {
      subTopics.push({
        title: match[1].trim(),
        contentURI: match[2].trim(),
        isVideo: match[3].toLowerCase() === "true",
      });
    }

    contents.push({
      mainTopic: currentTopic,
      description: topicDescription,
      subTopics,
    });
  }

  return {
    ...courseReference,
    contents,
  };
}
