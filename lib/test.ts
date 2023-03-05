import YouTubeMusic from './youtubemusic/YouTubeMusic.ts'

const ytm = new YouTubeMusic()
  .withVisitorId('CgtBTXhfYy1IVGc1cyi19-SeBg%3D%3D')

const res = await ytm.player('ORrFJ63nlcA')
if (res) {
  Deno.writeTextFileSync('1234.jsonc', JSON.stringify(res))
}