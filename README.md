# WhiteBreeze

A small frontend for [WhiteWind](https://whtwnd.com/), a Markdown blog service using [ATProto](https://atproto.com/), written in [ReactJS](https://react.dev/).
WhiteBreeze targets a single user and is meant for someone to self-host their WhiteWind blog posts, without needing to direct users to the WhiteWind website.

## Usage

Blog writing is done on WhiteWind, for now.
Due to [current limitations](https://bsky.app/profile/bnewbold.net/post/3lgbj2y32xc2s) of the BlueSky API regarding searching posts, comments will not automatically display under blog entries. If you have a bluesky post you want to show the comments of under a specific blog entry, at the very start of the content, put a link tag with the following:

```html
<link rel="post" href="<URL/URI>" />
```

where the URL/URI is either an AT URI to the post, OR the posts bsky.app URL. Doing this will display the post's likes, reposts, and replies at the end of the blog entry. Note that this only works for one post, multiple post links cannot be made.

### Development

```sh
pnpm install
pnpm run dev
```

### Production

Change environment variables:

```sh
HANDLE="myhandle.bsky.social" # Your handle, or DID
PORT=3000 # Port to host from
TITLE="My Blog" # Title to use in the top left next to the home icon
```

#### Standalone

```
pnpm run build
pnpm run start
```

#### Docker

```
docker compose build
docker compose up
```
