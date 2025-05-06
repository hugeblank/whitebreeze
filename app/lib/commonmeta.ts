import type { MetaDescriptors } from "react-router/route-module";

export const makeMeta: (
  url: string,
  title: string,
  handle: string,
) => MetaDescriptors = (url, title, handle) => {
  const host = url.match(/^(https?:\/\/.*\/).*$/);
  const out = [
    { property: "og:site_name", content: "WhiteBreeze" },
    { name: "twitter:card", content: "summary" },
    {
      name: "twitter:description",
      content: `View the WhiteBreeze blog of @${handle}`,
    },
    {
      name: "twitter:title",
      content: title,
    },
    {
      title: title,
    },
  ];
  console.log(url);
  if (host && host[1]) {
    out.push({
      name: "twitter:image",
      content: `${host[1]}favicon.png`,
    });
  }
  return out;
};
