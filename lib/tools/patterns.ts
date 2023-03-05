const pattern = {
  albumYear         : new RegExp(/^\d\d\d\d$/),
  seperatorText     : new RegExp(/^(&|,|•|-|_)$/),
  durationText      : new RegExp(/^[0-9]+:[0-9]+$/),
  albumType         : new RegExp(/^(EP|Album|Single)$/),
  songCount         : new RegExp(/^[0-9]+(.[0-9]+)?\s(song)s?$/),
  videoViews        : new RegExp(/^[0-9]+(.[0-9]+)?[B-M]?\s(view)?s?$/),
  videoLikes        : new RegExp(/^[0-9]+(.[0-9]+)?[B-M]?\s(like)?s?$/),
  mimeTypeOpus      : new RegExp(/^audio\/(webm|mp4); codecs="opus"$/),
  channelSubscribers: new RegExp(/^[0-9]+(.[0-9]+)?[B-M]?\s(subscriber)?s?$/),
  albumDuration     : new RegExp(/^[0-9]+(.[0-9]+)?\+?\s(minute|hour|day)s?/),
  itemType          : new RegExp(/^(EP|Album|Single|Artist|Video|Song|Playlist)$/),
}

export const isMimeTypeOpus = (arg: any) => {
  try {
    if (typeof arg !== 'string') arg = String(arg)
    return pattern.mimeTypeOpus.test(arg.trim())
  } catch {
    return false
  }
}

export const isItemType = (arg: any) => {
  try {
    if (typeof arg !== 'string') arg = String(arg)
    return pattern.itemType.test(arg.trim())
  } catch {
    return false
  }
}

export const isSongCountText = (arg: any) => {
  try {
    if (typeof arg !== 'string') arg = String(arg)
    return pattern.songCount.test(arg.trim())
  } catch {
    return false
  }
}

export const isAlbumDuration = (arg: any) => {
  try {
    if (typeof arg !== 'string') arg = String(arg)
    return pattern.albumDuration.test(arg.trim())
  } catch {
    return false
  }
}

export const isDurationText = (arg: any) => {
  try {
    if (typeof arg !== 'string') arg = String(arg)
    return pattern.durationText.test(arg.trim())
  } catch {
    return false
  }
}

export const isSeperatorText = (arg: any) => {
  try {
    if (typeof arg !== 'string') arg = String(arg)
    return pattern.seperatorText.test(arg.trim())
  } catch {
    return false
  }
}

export const isAlbumYear = (arg: any) => {
  try {
    if (typeof arg !== 'string') arg = String(arg)
    return pattern.albumYear.test(arg.trim())
  } catch {
    return false
  }
}

export const isAlbumType = (arg: any) => {
  try {
    if (typeof arg !== 'string') arg = String(arg)
    return pattern.albumType.test(arg.trim())
  } catch {
    return false
  }
}

export const isVideoViews = (arg: any) => {
  try {
    if (typeof arg !== 'string') arg = String(arg)
    return pattern.videoViews.test(arg.trim())
  } catch {
    return false
  }
}

export const isVideoLikes = (arg: any) => {
  try {
    if (typeof arg !== 'string') arg = String(arg)
    return pattern.videoLikes.test(arg.trim())
  } catch {
    return false
  }
}

export const isChannelSubscribers = (arg: any) => {
  try {
    if (typeof arg !== 'string') arg = String(arg)
    return pattern.channelSubscribers.test(arg.trim())
  } catch {
    return false
  }
}