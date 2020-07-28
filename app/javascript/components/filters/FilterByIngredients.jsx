import React from 'react'
import PropTypes from 'prop-types'
import FormGroup from '@material-ui/core/FormGroup'
import IngredientFamilyFilter from 'components/filters/IngredientFamilyFilter'
import IngredientTypeFilter from 'components/filters/IngredientTypeFilter'
import { sortByTagName } from 'services/sortService'

const FilterByIngredients = ({
  visibleTags,
  handleFilter,
  selectedFilters,
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
            handleFilter={handleFilter}
            selectedFilters={selectedFilters}
            visibleTags={visibleTags}
            tagNameById={tagNameById}
            childTags={tagGroups[t]}
            allTags={allTags}
          />
        ))}
        {tagsByType && sortByTagName(Object.keys(tagsByType), allTagTypes).map((t) => (
          <IngredientTypeFilter
            key={t}
            id={t}
            label={allTagTypes[t]}
            handleFilter={handleFilter}
            selectedFilters={selectedFilters}
            visibleTags={visibleTags}
            tagNameById={tagNameById}
            childTags={tagsByType[t]}
            allTags={allTags}
          />
        ))}
      </FormGroup>
    </div>
  )
}
export default FilterByIngredients

FilterByIngredients.propTypes = {
  handleFilter: PropTypes.func.isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.number),
  visibleTags: PropTypes.shape({}).isRequired,
  allTags: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  allTagTypes: PropTypes.shape({}).isRequired,
  tagGroups: PropTypes.shape({}).isRequired,
  tagsByType: PropTypes.shape({}).isRequired,
}

FilterByIngredients.defaultProps = {
  selectedFilters: [],
}
