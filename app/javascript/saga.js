import { recipesSaga } from 'bundles/recipes'
import { tagsSaga } from 'bundles/tags'

export default function* rootSaga() {
  yield* recipesSaga()
  yield* tagsSaga()
}
