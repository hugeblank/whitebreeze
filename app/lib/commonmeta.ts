import type { MetaDescriptors } from "react-router/route-module";
import { env } from "./env";

export const makeMeta: (
  location: Location,
  title: string,
) => MetaDescriptors = (location, title) => {
  return [
    { property: "og:site_name", content: "WhiteBreeze" },
    { name: "twitter:card", content: "summary" },
    {
      name: "twitter:description",
      content: `View the WhiteBreeze blog of @${env.HANDLE}`,
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
