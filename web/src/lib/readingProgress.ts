/**
 * Reading-progress arithmetic, kept out of the component so it can be tested
 * without a layout. The bar tracks the *article*, not the page: a lecture ends
 * with a video block, a prediction, a quiz, an embedded tool and prev/next
 * navigation, and progress through the prose should not move when the reader
 * reaches that scaffolding.
 */

/** The element the reading-progress bar measures: the prose column, not the page. */
export const LECTURE_ARTICLE_ID = 'lecture-article'

/** The article's box in document coordinates. */
export interface ArticleBox {
  /** Distance from the top of the document to the top of the article. */
  top: number;
  height: number;
}

/**
 * Fraction of the article the reader has scrolled through, clamped to [0, 1].
 *
 * The range runs from "article top aligned with the top of the viewport" to
 * "article bottom aligned with the bottom of the viewport". That is the only
 * definition that does not report progress while the reader is still looking
 * at the title, the prediction, or the quiz.
 *
 * Returns 0 when there is no article yet (lecture Markdown is lazy-loaded) and
 * when the article is not taller than the viewport: there is nothing to scroll
 * through, and claiming 100% before a word has been read would be a lie.
 */
export function readingProgress(
  article: ArticleBox | null,
  scrollY: number,
  viewportHeight: number,
): number {
  if (!article || !(article.height > 0) || !(viewportHeight > 0)) return 0
  const scrollable = article.height - viewportHeight
  if (scrollable <= 0) return 0
  const travelled = scrollY - article.top
  if (travelled <= 0) return 0
  if (travelled >= scrollable) return 1
  return travelled / scrollable
}

/** Whole-percent reading progress, for aria-valuenow. */
export function readingPercent(fraction: number): number {
  if (!Number.isFinite(fraction)) return 0
  return Math.round(Math.min(1, Math.max(0, fraction)) * 100)
}
