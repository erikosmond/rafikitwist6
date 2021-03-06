import React from 'react'
import PropTypes from 'prop-types'
import MobileNavDrawer from 'components/recipes/MobileNavDrawer'
import FilterChips from 'containers/FilterChipsContainer'
import RecipeListColumn from 'containers/RecipeListColumnContainer'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Footer = styled.div`
  width: 100%;
  position: fixed;
  bottom: 1px;
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

class MobileRecipeList extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }

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
    const { clearErrors, clearFilters, resetPagedCount } = this.props
    clearFilters()
    resetPagedCount()
    clearErrors()
  }

  static renderRecipes({
    loading,
    noRecipes,
    recipesLoaded,
    selectedTag,
  }) {
    if (this.noRecipes || noRecipes) {
      return (
        <div>
          We do not have any recipes like that.
        </div>
      )
    } if (loading || !selectedTag || !recipesLoaded) {
      return (
        <div>
          Loading...
        </div>
      )
    }
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
      drawerValueFromStore,
      loading,
      mobileDrawerState,
      noRecipes,
      updateMobileDrawerState,
      recipesLoaded,
      selectedTag,
    } = this.props
    return (
      <div>
        <Header>
          <FilterChips />
        </Header>
        {MobileRecipeList.renderRecipes({
          selectedTag,
          loading,
          noRecipes,
          recipesLoaded,
        })}
        <Footer>
          <MobileNavDrawer
            mobileDrawerState={mobileDrawerState}
            updateMobileDrawerState={updateMobileDrawerState}
            drawerValueFromStore={drawerValueFromStore}
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
  recipesLoaded: PropTypes.bool,
  loading: PropTypes.bool,
  noRecipes: PropTypes.bool,
  updateMobileDrawerState: PropTypes.func.isRequired,
  drawerValueFromStore: PropTypes.number,
  clearErrors: PropTypes.func.isRequired,
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
  recipesLoaded: false,
  loading: true,
  noRecipes: true,
  drawerValueFromStore: -1,
}

export default MobileRecipeList
