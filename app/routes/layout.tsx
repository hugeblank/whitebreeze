import { Link, Outlet } from "react-router";
import type { Route } from "./+types/layout";
import { diddoc, resolveProfile } from "~/lib/resolver.server";
import Profile from "~/components/Profile";
import { env } from "~/lib/env.server";
import { HomeIcon } from "lucide-react";

export async function loader({}: Route.LoaderArgs) {
  return {
    profile: await resolveProfile(diddoc.id),
    title: env.TITLE,
  };
}

export default function Layout({
  loaderData: { profile, title },
}: Route.ComponentProps) {
  return (
    <>
      <header className="container m-3 mx-auto">
        <div className="my-2 flex flex-row">
          <Link className="align-center h-full w-fit" to="/">
            <h1 className="flex flex-row items-center text-3xl font-semibold text-blue-500 hover:text-blue-300">
              <HomeIcon size={32} />
              &nbsp;{title}
            </h1>
          </Link>
        </div>
        {profile && <Profile {...profile} />}
      </header>
      <main className="container mx-auto mt-8">
        <Outlet />
      </main>
      <footer className="mt-8 text-center">
        Powered by &nbsp;
        <Link
          className="text-blue-500 hover:text-blue-300 hover:underline"
          to="https://github.com/hugeblank/whitebreeze"
        >
          <img className="inline-block size-6" src="/favicon.png"></img>{" "}
          WhiteBreeze
        </Link>
      </footer>
    </>
  );
}
