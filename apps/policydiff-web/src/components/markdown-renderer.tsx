import { remark } from "remark";
import html from "remark-html";

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

interface MarkdownRendererProps {
  content: string;
}

export async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const htmlContent = await markdownToHtml(content);
  return (
    <div
      className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
