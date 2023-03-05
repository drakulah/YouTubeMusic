import { isNullOrEmpty, LoopThrough } from '../../../tools/inline.ts'

export interface Thumbnail {
  url: string,
  width: number,
  height: number
}

/**
 * Provide `Object.background` or `Object.thumbnail` or `Object.thumbnailRenderer`
 */
export default (raw: any) => {
  const _thumbnail: Thumbnail[] = []

  LoopThrough(raw?.thumbnails
    ?? raw?.musicThumbnailRenderer?.thumbnail?.thumbnails
    ?? raw?.croppedSquareThumbnailRenderer?.thumbnail?.thumbnails, (_, thumbnail: any) => {
      if (!isNullOrEmpty(thumbnail?.url)) _thumbnail.push({
        url: thumbnail?.url,
        width: thumbnail.width,
        height: thumbnail?.height
      })
    })

  return _thumbnail
}