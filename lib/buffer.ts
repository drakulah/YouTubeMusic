import YouTubeMusic from "./youtubemusic/YouTubeMusic.ts";
import { serve } from "https://deno.land/std@0.177.0/http/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"
import { serveFile } from "https://deno.land/std@0.177.0/http/file_server.ts";

/*
  const videoId = context?.params?.id
  if (!videoId) return
  const YTM = new YouTubeMusic()
  const player = await YTM.player(videoId)
  const url = player?.audioFormats?.at(0)?.url
  if (!url) return
  const filPath = `./.cache/${videoId}.opus`
  const fetched = await fetch(url)
  const body = fetched.body
  if (!body) return
  await Deno.writeFile(filPath, body)
*/

serve(async (req) => {
  const url = new URL(req.url)
  const videoId = url.searchParams.get('id')
  if (!videoId) return new Response()
  const YTM = new YouTubeMusic()
  const player = await YTM.player(videoId)
  const audioUrl = player?.audioFormats?.at(0)?.url
  if (!audioUrl) return new Response()
  const filPath = `./.cache/${videoId}.opus`
  const fetched = await fetch(audioUrl)
  const body = fetched.body
  if (!body) return new Response()
  await Deno.writeFile(filPath, body)
  serveFile(req, filPath)
}, {
  port: 8080,
  hostname: 'localhost',
  onListen: (e) => console.log('Listening at', e.hostname + ':' + e.port)
});