import React from 'react'
import PropTypes from 'prop-types'
import MobileNavDrawer from 'components/recipes/MobileNavDrawer'
import FilterChips from 'containers/FilterChipsContainer'
import RecipeListColumn from 'containers/RecipeListColumnContainer'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Footer = styled.div`
  width: 100%;
  position: sticky;
  bottom: 0px;
  z-index: 1;
`
const Header = styled.div`
  top: 0px;
  position: sticky;
  z-index: 1;
  height: 100%;
`

const Body = styled.div`
  margin-bottom: 65px;
  overflow: scroll; 
`

// TODO: add og meta tags to this page

class MobileRecipeList extends React.Component {
  componentDidUpdate(lastProps) {
    const {
      loadRecipes, loadTagInfo, location, match,
    } = this.props
    if (lastProps.location !== location) {
      lastProps.clearFilters()
      lastProps.resetPagedCount()
      const { tagId } = match.params
      if (tagId) {
        loadRecipes(tagId)
        loadTagInfo(tagId)
      }
    }
  }

  componentWillUnmount() {
    const { clearFilters, resetPagedCount } = this.props
    clearFilters()
    resetPagedCount()
  }

  static renderRecipes({
    selectedTag,
  }) {
    return (
      <div>
        {selectedTag.description && selectedTag.description.length > 0 && (
          <div>
            {selectedTag.description}
            <br />
            <br />
          </div>
        )}
        {selectedTag.recipeId && selectedTag.recipeId > 0 && (
          <div>
            <Link to={`/recipes/${selectedTag.recipeId}`}>
              See recipe
            </Link>
            <br />
          </div>
        )}
        <Body>
          <RecipeListColumn />
        </Body>
      </div>
    )
  }

  render() {
    const {
      mobileDrawerState,
      updateMobileDrawerState,
      selectedTag,
    } = this.props
    return (
      <div>
        <Header>
          <FilterChips />
        </Header>
        {MobileRecipeList.renderRecipes({ selectedTag })}
        <Footer>
          <MobileNavDrawer
            mobileDrawerState={mobileDrawerState}
            updateMobileDrawerState={updateMobileDrawerState}
          />
        </Footer>
      </div>
    )
  }
}

MobileRecipeList.propTypes = {
  mobileDrawerState: PropTypes.shape({
    filters: PropTypes.bool,
    search: PropTypes.bool,
    similar: PropTypes.bool,
  }),
  updateMobileDrawerState: PropTypes.func.isRequired,
  loadRecipes: PropTypes.func.isRequired,
  loadTagInfo: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  resetPagedCount: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      tagId: PropTypes.string,
    }),
  }).isRequired,
  selectedTag: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    grandparentTags: PropTypes.shape({}),
    parentTags: PropTypes.shape({}),
    childTags: PropTypes.shape({}),
    grandchildTags: PropTypes.shape({}),
    sisterTags: PropTypes.shape({}),
    modificationTags: PropTypes.shape({}),
    modifiedTags: PropTypes.shape({}),
  }).isRequired,
}

MobileRecipeList.defaultProps = {
  mobileDrawerState: {
    filters: false,
    search: false,
    similar: false,
  },
}

export default MobileRecipeList
