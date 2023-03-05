import { Let, LoopThrough } from '../../../tools/inline.ts'
import parseMoodCard, { MoodCard } from '../object/parseMoodCard.ts'

interface Header {
  title: string
}

type Content = MoodCard

interface Container {
  header: Header,
  contents: Content[]
}

interface MoodAndGrene {
  header: Header,
  contents: Container[]
}

export default (rawRes: any): MoodAndGrene => {
  if (typeof rawRes !== 'object' || typeof rawRes === null) throw new Error('Invalid input data')

  // Declare constants
  const _container: Container[] = []
  const _pageHeader = { title: rawRes?.header?.musicHeaderRenderer?.title?.runs?.[0]?.text ?? 'Moods & genres' }

  // Start parsing
  Let(rawRes?.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer, (sharedSection) => {

    // Loop through all components
    LoopThrough(sharedSection?.contents, (_, eachComponent: any) => {

      // Parse mainly interacted items
      Let(eachComponent?.gridRenderer, (sharedContainer) => {

        const _contents: Content[] = []
        let _header: Header | undefined

        // Parse header
        Let(sharedContainer?.header?.gridHeaderRenderer, (sharedHeader) => {
          _header = {
            title: sharedHeader?.title?.runs?.[0]?.text ?? '',
          }
        })

        // Loop through every items
        LoopThrough(sharedContainer?.items, (_, eachItem: any) => {
          const _moodCard = parseMoodCard(eachItem?.musicNavigationButtonRenderer)
          if (!_moodCard) return
          _contents.push(_moodCard)
        })

        _container.push({
          header: _header!,
          contents: _contents
        })

      })

    })

  })

  return {
    header: _pageHeader,
    contents: _container
  }
}