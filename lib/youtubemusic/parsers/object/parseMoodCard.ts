import { areNullOrEmpty } from '../../../tools/inline.ts'

export interface MoodCard {
  title: string,
  color: number,
  browseId: string,
  params: string
}

export default (raw: any): MoodCard | undefined => {
  const _card: MoodCard = {
    color: raw?.solid?.leftStripeColor,
    title: raw?.buttonText?.runs?.[0]?.text,
    params: raw?.clickCommand?.browseEndpoint?.params,
    browseId: raw?.clickCommand?.browseEndpoint?.browseId
  }

  if (
    typeof _card.color !== 'number'
    || areNullOrEmpty(_card.title, _card.browseId, _card.params)
    || !_card.browseId?.startsWith('FEmusic_moods')
  ) return undefined

  return _card
}