import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

export default function FocusedAnchor(props: React.ComponentProps<"a">) {
  const [targeted, setTarget] = useState<boolean>(false);
  const { className, href, ...rest } = props;

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.hash === href) {
      setTarget(true);
    } else {
      setTarget(false);
    }
  }, [href, setTarget]);

  return targeted ? (
    <a
      {...rest}
      href={href}
      className={cn(className, "border-2 border-blue-300")}
    />
  ) : (
    <a {...props} />
  );
}
