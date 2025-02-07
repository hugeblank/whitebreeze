# WhiteBreeze
A small frontend for [WhiteWind](https://whtwnd.com/), a MarkDown blog service using [ATProto](https://atproto.com/).
WhiteBreeze targets a single user and is meant for someone to self-host their WhiteWind blog posts, without having to direct users to the WhiteWind website.

## Usage

### Development

```sh
npm install
npm run dev
```

### Production

Change environment variables:
```sh
PUBLIC_HANDLE="myhandle.bsky.social" # Your handle, or DID
```

#### Standalone

```
npm install
npm run build
node index.js
```
Put environment variables ahead of the last command, port can also be configured with `PORT`.

#### Dockerized
Modify `docker-compose.yaml` and change the host port if necessary.

```
docker compose up
```