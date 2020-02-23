import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import QuotesDisplay from '../../../app/javascript/components/recipes/RecipeList'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    loadRecipes: jest.fn(),
    selectedRecipes: [],
    recipesLoaded: true,
    history: {
      push: jest.fn(),
    },
    location: {
      search: jest.fn(),
    },
  }

  const enzymeWrapper = mount(<RecipesList {...props} />)

  return {
    props,
    enzymeWrapper,
  }
}

describe('components', () => {
  describe('RecipeList', () => {
    it('should render self and subcomponents', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('div').hasClass('')).toBe(true)

      expect(enzymeWrapper.find(RecipesList).render().text()).toBe("Recipes Loaded")
    })
  })
})
