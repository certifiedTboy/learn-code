import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { languageAliases } from "@/lib/mock-data";

export const transform = (
  node: HTMLElement,
  _children: React.ReactNode[],
): React.ReactNode | undefined => {
  // Interweave provides HTML tag names in uppercase.
  if (node.tagName !== "PRE") {
    return undefined;
  }

  const codeElement = node.querySelector(":scope > code");

  if (!codeElement) {
    return undefined;
  }

  const className = codeElement.getAttribute("class") ?? "";

  const languageMatch = className.match(/(?:^|\s)language-([^\s]+)/i);
  const detectedLanguage = languageMatch?.[1]?.toLowerCase() ?? "text";

  const language = languageAliases[detectedLanguage] ?? detectedLanguage;

  // textContent preserves spaces, indentation and line breaks.
  const code = codeElement.textContent ?? "";

  return (
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      //   showLineNumbers
      wrapLongLines
      PreTag="div"
      customStyle={{
        maxWidth: "100%",
        margin: "0.9em 0",
        padding: "0.85em 0.9em",
        overflowX: "auto",
        border: "1px solid rgb(148 163 184 / 14%)",
        borderRadius: "12px",
        background: "#101a2b",
        fontSize: "0.85em",
        lineHeight: 1.6,
      }}
      codeTagProps={{
        style: {
          fontFamily:
            '"Fira Code", "Cascadia Code", Consolas, Monaco, monospace',
        },
      }}
    >
      {code.replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
};
