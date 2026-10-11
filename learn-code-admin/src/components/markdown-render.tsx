import { marked } from "marked";
import { useMemo } from "react";
import { Interweave } from "interweave";
import { transform } from "./transform";

interface MarkdownRendererProps {
  content?: string;
}

export function MarkdownRender({ content }: MarkdownRendererProps) {
  const renderedContent = useMemo(
    () =>
      content
        ? marked.parse(content, {
            async: false,
            gfm: true,
            breaks: true,
          })
        : "",
    [content],
  );

  return (
    <div className="ai-chat-markdown">
      <Interweave content={renderedContent} transform={transform} />
    </div>
  );
}
