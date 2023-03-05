import { LoopThrough } from '../../../tools/inline.ts'

/**
 * Provide `Object.badges` or `Object.subtitleBadges`
 */
export default (raw: any) => {
  const _res = {
    isExplicit: false
  }

  LoopThrough(raw, (_, eachBadge: any) => {
    if (eachBadge?.musicInlineBadgeRenderer?.icon?.iconType?.toUpperCase()?.includes('EXPLICIT')) _res.isExplicit = true
  })

  return _res

}