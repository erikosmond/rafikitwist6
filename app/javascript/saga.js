import { recipesSaga } from 'bundles/recipes'

export default function* rootSaga() {
  yield* recipesSaga()
}
