import React from 'react'
import PropTypes from 'prop-types'
import FormGroup from '@material-ui/core/FormGroup'
import IngredientFamilyFilter from 'containers/IngredientFamilyFilterContainer'
import IngredientTypeFilter from 'containers/IngredientTypeFilterContainer'
import { sortByTagName } from 'services/sortService'

// TODO (should be done):
// do not pass in props from MobileNavDrawer and RecipeListSkeleton

const FilterByIngredients = ({
  allTags,
  tagGroups,
  tagsByType,
  allTagTypes,
}) => {
  function tagNameById(id) {
    return allTags[id]
  }
  return (
    <div>
      <h2> Filters </h2>
      <FormGroup>
        {tagGroups && sortByTagName(Object.keys(tagGroups), allTags).map((t) => (
          <IngredientFamilyFilter
            key={t}
            id={t}
            label={allTags[t]}
            tagNameById={tagNameById}
            childTags={tagGroups[t]}
          />
        ))}
        {tagsByType && sortByTagName(Object.keys(tagsByType), allTagTypes).map((t) => (
          <IngredientTypeFilter
            key={t}
            id={t}
            label={allTagTypes[t]}
            tagNameById={tagNameById}
            childTags={tagsByType[t]}
          />
        ))}
      </FormGroup>
    </div>
  )
}
export default FilterByIngredients

FilterByIngredients.propTypes = {
  visibleTags: PropTypes.shape({}).isRequired,
  allTags: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  allTagTypes: PropTypes.shape({}).isRequired,
  tagGroups: PropTypes.shape({}).isRequired,
  tagsByType: PropTypes.shape({}).isRequired,
}
