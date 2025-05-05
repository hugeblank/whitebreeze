import { Link, Outlet } from "react-router";
import type { Route } from "./+types/layout";
import { diddoc, resolveProfile } from "~/lib/resolver.server";
import Profile from "~/components/Profile";
import { env } from "~/lib/env";

export async function loader({}: Route.LoaderArgs) {
  return {
    profile: await resolveProfile(diddoc.id),
    title: env.TITLE,
  };
}

export default function Layout({
  loaderData: { profile, title },
}: Route.ComponentProps) {
  console.log(profile);
  return (
    <>
      <header className="m-3">
        <div className="flex w-full flex-row items-center justify-between gap-4">
          <Link className="align-center h-full w-fit" to="/">
            <h1 className="block text-3xl font-semibold text-blue-500 hover:text-blue-300">
              {title}
            </h1>
          </Link>
          <Link to="/about" className="align-center">
            <h1 className="block text-3xl font-semibold text-blue-500 hover:text-blue-300">
              About
            </h1>
          </Link>
        </div>
      </header>
      {profile && <Profile {...profile} />}
      <div className="mt-8">
        <Outlet />
      </div>
      <footer className="mt-8 text-center">
        Powered by &nbsp;
        <Link
          className="text-blue-500 hover:text-blue-300 hover:underline"
          to="https://github.com/hugeblank/whitebreeze"
        >
          WhiteBreeze
        </Link>
      </footer>
    </>
  );
}
