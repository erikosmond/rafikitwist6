import reducer from '../../../app/javascript/bundles/recipes'

describe('todos reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      selectedRecipes: [],
      recipesLoaded: false,
    })
  })

  it('should handle ADD_TODO', () => {
    expect(reducer({ selectedQuotes: ['hi'] }, {
      type: 'recipes/loadRecipes',
      payload: 1,
    })).toEqual({
      selectedQuotes: [],
    })
  })
})
