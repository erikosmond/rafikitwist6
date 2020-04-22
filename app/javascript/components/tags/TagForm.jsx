import React from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import TagFormStyles from 'components/styled/RecipeFormStyles'
import RecipeFormTagSelectors from 'components/recipes/RecipeFormTagSelectors'
import { withStyles } from '@material-ui/core/styles';

const styles = () => (TagFormStyles)

let TagForm = (props) => {
  const {
    classes,
    handleSubmit,
  } = props

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.container}>
        <div className={classes.nameLabel} htmlFor="recipeName">Recipe Name</div>
        <Field name="tagName" component="input" type="text" />
        {/* <Field className={classes.nameField} name="recipeName" component="input" type="text" /> */}
      </div>
      <Field
        name="sources"
        component={RecipeFormTagSelectors}
        props={{
          tagOptions: [{ Value: 'hi', Label: 'Bye' }],
          title: 'Sources',
        }}
      />
      <br />
      <button type="submit">Save</button>
    </form>
  )
}

// TODO: add initial field values
TagForm = reduxForm({
  form: 'tagForm',
})(TagForm)

TagForm.propTypes = {
  // tagOptions: PropTypes.shape(),
  classes: PropTypes.shape({
    container: PropTypes.string,
    nameLabel: PropTypes.string,
    nameField: PropTypes.string,
    descriptionLabel: PropTypes.string,
    descriptionField: PropTypes.string,
    instructionsField: PropTypes.string,
    instructionsLabel: PropTypes.string,
  }),
  // handleSubmit is passed in from ReduxForm, but if it's marked as required,
  // a js error is logged as missing,
  // eslint-disable-next-line react/require-default-props
  handleSubmit: PropTypes.func,
}

TagForm.defaultProps = {
  classes: {},
}

export default withStyles(styles)(TagForm)
