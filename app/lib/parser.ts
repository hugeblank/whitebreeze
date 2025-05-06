import { type Plugin } from "unified";
import { type Node } from "unist";
import type { Element, Root } from "hast";
import { defaultSchema, type Options } from "rehype-sanitize";

// WhiteWind's own custom schema:
// https://github.com/whtwnd/whitewind-blog/blob/7eb8d4623eea617fd562b93d66a0e235323a2f9a/frontend/src/services/DocProvider.tsx#L122
export const whitewindSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    font: [...(defaultSchema.attributes?.font ?? []), "color"],
    blockquote: [
      ...(defaultSchema.attributes?.blockquote ?? []),
      // bluesky
      "className",
      "dataBlueskyUri",
      "dataBlueskyCid",
      // instagram
      "dataInstgrmCaptioned",
      "dataInstgrmPermalink",
      "dataInstgrmVersion",
    ],
    iframe: [
      "width",
      "height",
      "title",
      "frameborder",
      "allow",
      "referrerpolicy",
      "allowfullscreen",
      "style",
      "seamless",
      ["src", /https:\/\/(www.youtube.com|bandcamp.com)\/.*/],
    ],
    section: ["dataFootnotes", "className"],
  },
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "font",
    "mark",
    "iframe",
    "section",
  ],
} as Options;

// Next 2 functions are derived from whitewind:
// https://github.com/whtwnd/whitewind-blog/blob/047c8d44b5a13e5b8518823982c486e9e3df50c0/frontend/src/services/DocProvider.tsx#L92-L122
const PREFIX = "user-content-user-content-";
const fixFootnote = (child: Node): void => {
  if (child.type !== "element") {
    return;
  }
  const elem = child as unknown as Element;

  // Fix footnote link
  // rehypeGfm creates link #user-content-fn-1 or something like that. It also adds ids like #user-content-fn-1 to footnote <li> elements
  // rehypeSanitize adds "user-content-" to all HTML ids. As a result, li elements will have ids like #user-content-user-content-fn-1
  // this fixes that
  const id = elem.properties.id;
  if (id !== undefined && typeof id === "string" && id.startsWith(PREFIX)) {
    elem.properties.id = id.replace(PREFIX, "user-content-");
  }
  elem.children.forEach((child) => fixFootnote(child));
};

export const rehypeFixFootnote: Plugin<[], Root, Node> = () => {
  return (tree: Root) => {
    tree.children.forEach((child) => fixFootnote(child));
  };
};
