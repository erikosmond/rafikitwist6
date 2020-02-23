import * as actions from '../../../app/javascript/bundles/recipes'

describe('actions', () => {
  debugger
  it('should load recipes', () => {
    const tagId = 1
    const expectedAction = {
      type: 'recipes/loadRecipes',
      payload: tagId,
    }
    expect(actions.loadRecipes(tagId)).toEqual(expectedAction)
  })
})
