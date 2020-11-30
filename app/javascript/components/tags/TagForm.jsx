import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import TagFormStyles from 'components/styled/TagFormStyles'
import RecipeFormTagSelectors from 'components/recipes/RecipeFormTagSelectors'
import { withStyles } from '@material-ui/core/styles'

const styles = () => (TagFormStyles)

let TagForm = (props) => {
  const {
    tagOptions,
    classes,
    handleSubmit,
    tagTypes,
  } = props

  const buildParentTagDropdown =
    tagOptions.ingredientCategory
      .concat(tagOptions.ingredientFamily)
      .concat(tagOptions.ingredientType)

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.container}>
        <div className={classes.nameLabel} htmlFor="tagName">Tag Name</div>
        <Field className={classes.nameField} name="name" component="input" type="text" />
        <div className={classes.descriptionLabel} htmlFor="description">Description</div>
        <Field className={classes.descriptionField} name="description" component="input" type="text" />
        <div className={classes.parentTags}>
          <Field
            name="parentTags"
            component={RecipeFormTagSelectors}
            props={{
              tagOptions: buildParentTagDropdown,
              title: 'Parent Tags',
            }}
          />
        </div>
        <div className={classes.tagType}>
          <label>Tag Type</label>
          <Field name="tagTypeId" component="select">
            <option />
            {tagTypes.map((tagType) => (

              <option key={tagType.id} value={tagType.id}>
                {tagType.name}
              </option>
            ))}
          </Field>
        </div>
        <br />
        <button className={classes.saveButton} type="submit">Save</button>
      </div>
    </form>
  )
}

TagForm = reduxForm({
  form: 'tagForm',
})(TagForm)

TagForm.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
    nameLabel: PropTypes.string,
    nameField: PropTypes.string,
    descriptionLabel: PropTypes.string,
    descriptionField: PropTypes.string,
    parentTags: PropTypes.string,
    tagType: PropTypes.string,
    saveButton: PropTypes.string,
  }),
  // handleSubmit is passed in from ReduxForm, but if it's marked as required,
  // a js error is logged as missing,
  // eslint-disable-next-line react/require-default-props
  handleSubmit: PropTypes.func,
  tagTypes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tagOptions: PropTypes.shape({
    ingredientCategory: PropTypes.arrayOf(PropTypes.shape({})),
    ingredientFamily: PropTypes.arrayOf(PropTypes.shape({})),
    ingredientType: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
}

TagForm.defaultProps = {
  classes: {},
}

export default withStyles(styles)(TagForm)
