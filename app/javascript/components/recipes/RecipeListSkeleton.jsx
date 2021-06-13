import React from 'react'
import PropTypes from 'prop-types'
import RecipeList from 'containers/RecipeListContainer'
import OuterWrapper from '../styled/OuterWrapper'

class RecipeListSkeleton extends React.Component {
  static recipesReady(props) {
    return props.loading !== undefined && !props.loading &&
    props.tagsByType !== undefined && Object.keys(props.tagsByType).length > 0 &&
    props.priorities !== undefined && Object.keys(props.priorities).length > 0 &&
    props.ratings !== undefined && Object.keys(props.ratings).length > 0 &&
    props.allTags !== undefined && Object.keys(props.allTags).length > 0 &&
    props.allTagTypes !== undefined && Object.keys(props.allTagTypes).length > 0 &&
    props.selectedRecipes !== undefined &&
    props.visibleRecipeCount !== undefined &&
    props.selectedTag !== undefined
  }

  componentDidMount() {
    const {
      loadRecipes,
      loadTagInfo,
      startingTagId,
      match,
    } = this.props
    const { tagId } = match.params
    if (tagId) {
      loadRecipes(tagId)
      loadTagInfo(tagId)
    } else if (startingTagId) {
      loadRecipes(startingTagId)
      loadTagInfo(startingTagId)
    } else {
      this.noRecipes = true
    }
  }

  render() {
    if (RecipeListSkeleton.recipesReady(this.props)) {
      return (
        <OuterWrapper>
          <RecipeList />
        </OuterWrapper>
      )
    }
    return (<div> Loading... </div>)
  }
}

RecipeListSkeleton.propTypes = {
  loadRecipes: PropTypes.func.isRequired,
  loadTagInfo: PropTypes.func.isRequired,
  tagGroups: PropTypes.shape({}).isRequired,
  allTags: PropTypes.shape({
    id: PropTypes.number,
  }),
  allTagTypes: PropTypes.shape({
    id: PropTypes.number,
  }),
  tagsByType: PropTypes.shape({}),
  visibleFilterTags: PropTypes.shape({}),
  startingTagId: PropTypes.string.isRequired,
  selectedTag: PropTypes.shape({}),
  priorities: PropTypes.shape({}),
  ratings: PropTypes.shape({}),
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      tagId: PropTypes.string,
    }),
  }).isRequired,
}

RecipeListSkeleton.defaultProps = {
  allTags: {},
  allTagTypes: {},
  tagsByType: {},
  visibleFilterTags: {},
  selectedTag: {},
  priorities: {},
  ratings: {},
}
export default RecipeListSkeleton
