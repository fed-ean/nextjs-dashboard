import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { renderers } from "@/app/lib/htmlRenderers";

export default function PostContent({ content }) {
  const cleanContent = DOMPurify.sanitize(content);

  return (
    <div className="prose prose-lg max-w-none">
      {parse(cleanContent, {
        replace: (domNode) => {
          if (renderers[domNode.name]) {
            const children = domNode.children?.map((child, i) =>
              child.type === "text"
                ? child.data
                : parse(child, { key: i })
            );
            return renderers[domNode.name](domNode, children);
          }
        },
      })}
    </div>
  );
}