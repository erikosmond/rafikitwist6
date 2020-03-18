import React from 'react'
import PropTypes from 'prop-types'
import FormGroup from '@material-ui/core/FormGroup'
import PaperSidebar from 'components/styled/PaperSidebar'
import IngredientFamilyFilter from 'components/filters/IngredientFamilyFilter'
import IngredientTypeFilter from 'components/filters/IngredientTypeFilter'

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
    <PaperSidebar>
      <h2> Filters </h2>
      <FormGroup>
        {tagGroups && Object.keys(tagGroups).map((t) => (
          <IngredientFamilyFilter
            key={t}
            id={t}
            label={allTags[t]}
            handleFilter={handleFilter}
            selectedFilters={selectedFilters}
            visibleTags={visibleTags}
            tagNameById={tagNameById}
            childTags={tagGroups[t]}
          />
        ))}
        {tagsByType && Object.keys(tagsByType).map((t) => (
          <IngredientTypeFilter
            key={t}
            id={t}
            label={allTagTypes[t]}
            handleFilter={handleFilter}
            selectedFilters={selectedFilters}
            visibleTags={visibleTags}
            tagNameById={tagNameById}
            childTags={tagsByType[t]}
          />
        ))}
      </FormGroup>
    </PaperSidebar>
  )
}
export default FilterByIngredients

FilterByIngredients.propTypes = {
  handleFilter: PropTypes.func.isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.number),
  visibleTags: PropTypes.shape({}).isRequired,
  allTags: PropTypes.shape({}).isRequired,
  allTagTypes: PropTypes.shape({}).isRequired,
  tagGroups: PropTypes.shape({}).isRequired,
  tagsByType: PropTypes.shape({}).isRequired,
}

FilterByIngredients.defaultProps = {
  selectedFilters: [],
}
