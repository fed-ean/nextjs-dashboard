import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";

// Este objeto define cómo renderizar cada etiqueta HTML
export const renderers = {
  p: (domNode, children) => (
    <p key={domNode.attribs?.id || Math.random()} className="mb-4 leading-relaxed text-gray-700">
      {children}
    </p>
  ),

  h1: (domNode, children) => (
    <h1 key={Math.random()} className="text-3xl font-bold mb-4 text-gray-900">
      {children}
    </h1>
  ),

  h2: (domNode, children) => (
    <h2 key={Math.random()} className="text-2xl font-semibold mb-3 text-gray-800">
      {children}
    </h2>
  ),

  ul: (domNode, children) => (
    <ul key={Math.random()} className="list-disc pl-6 mb-4 text-gray-700">
      {children}
    </ul>
  ),

  ol: (domNode, children) => (
    <ol key={Math.random()} className="list-decimal pl-6 mb-4 text-gray-700">
      {children}
    </ol>
  ),

  li: (domNode, children) => (
    <li key={Math.random()} className="mb-1">
      {children}
    </li>
  ),

  a: (domNode, children) => (
    <Link
      key={Math.random()}
      href={domNode.attribs.href}
      target="_blank"
      className="text-blue-600 underline hover:text-blue-800"
    >
      {children}
    </Link>
  ),

  img: (domNode) => (
    <Image
      key={Math.random()}
      src={domNode.attribs.src}
      alt={domNode.attribs.alt || ""}
      width={800}
      height={500}
      className="rounded-lg shadow-md my-4"
    />
  ),
};
