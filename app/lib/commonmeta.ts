import type { MetaDescriptors } from "react-router/route-module";

export const makeMeta: (
  location: Location,
  title: string,
  handle: string,
) => MetaDescriptors = (location, title, handle) => {
  return [
    { property: "og:site_name", content: "WhiteBreeze" },
    { name: "twitter:card", content: "summary" },
    {
      name: "twitter:description",
      content: `View the WhiteBreeze blog of @${handle}`,
    },
    {
      name: "twitter:image",
      content: `https://${location.host}/favicon.png`,
    },
    {
      name: "twitter:title",
      content: title,
    },
    {
      title: title,
    },
  ];
};
