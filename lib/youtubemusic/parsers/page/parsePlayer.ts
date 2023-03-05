import player from '../../../samples/player.ts'
import { Let, LoopThrough } from '../../../tools/inline.ts'
import parseThumbnail, { Thumbnail } from '../component/parseThumbnail.ts'

interface VideoDetails {
  id: string,
  title: string,
  playable: boolean,
  views: string,
  isLive: boolean,
  author: string,
  channelId: string,
  duration: number,
  thumbnails: Thumbnail[],
}

interface AudioFormat {
  url: string,
  contentType: string,
  audioCodec: string,
  audioSampleRate: string,
  audioChannels: number,
  bitrate: number,
  avgBitrate: number,
  lastModified: string,
  approxSize: number,
  approxDuration: number,
}

interface Player {
  details: VideoDetails,
  audioFormats: AudioFormat[]
}

export default (rawRes: any): Player => {
  if (typeof rawRes !== 'object' || typeof rawRes === null) throw new Error('Invalid input data')

  // Details
  let _id: string | undefined
  let _title: string | undefined
  let _views: string | undefined
  let _author: string | undefined
  let _channelId: string | undefined
  let _duration = 0
  let _isLive = false

  const audioFormats: AudioFormat[] = []

  // Parse Details
  Let(rawRes?.videoDetails, (sharedDetail) => {
    _id = sharedDetail?.videoId
    _title = sharedDetail?.title
    _views = sharedDetail?.viewCount
    _author = sharedDetail?.author
    _channelId = sharedDetail?.channelId
    _duration = parseInt(sharedDetail?.lengthSeconds)
    _isLive = sharedDetail?.isLiveContent
  })

  LoopThrough(rawRes?.streamingData?.adaptiveFormats, (_, eachFormat: any) => {
    const mimeType = eachFormat?.mimeType
    if (!mimeType?.startsWith('audio')) return
    const splitted = mimeType.split(';')
    splitted[1] = (splitted.length === 2) ? splitted[1].split('=').at(1)?.replaceAll('"', '') ?? '' : ''

    audioFormats.push({
      url: eachFormat?.url,
      contentType: splitted[0].trim(),
      audioCodec: splitted[1].trim(),
      audioChannels: eachFormat?.audioChannels ?? 0,
      audioSampleRate: eachFormat?.audioSampleRate ?? '41000',
      avgBitrate: eachFormat?.averageBitrate,
      bitrate: eachFormat?.bitrate,
      approxDuration: parseInt(eachFormat?.approxDurationMs),
      approxSize: parseInt(eachFormat?.contentLength),
      lastModified: eachFormat?.lastModified
    })
  })

  return {
    details: {
      id: _id!,
      title: _title!,
      views: _views!,
      author: _author!,
      channelId: _channelId!,
      duration: _duration,
      isLive: _isLive,
      playable: rawRes?.playabilityStatus?.status === 'OK',
      thumbnails: parseThumbnail(rawRes?.videoDetails?.thumbnail)
    },
    audioFormats: audioFormats.sort((a, b) => b.bitrate - a.bitrate && b.avgBitrate - a.avgBitrate)
  }
}