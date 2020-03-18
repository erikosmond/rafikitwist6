import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import { Link } from 'react-router-dom'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import RecipeProperties from 'components/recipes/RecipeProperties'
import RecipeInstructions from 'components/recipes/RecipeInstructions'
import RecipeDescription from 'components/recipes/RecipeDescription'
import RecipeHeaderActions from 'components/recipes/RecipeHeaderActions'
import { allIngredients } from 'services/recipes'

const styles = () => ({
  card: {
    maxWidth: 400,
  },
})

class RecipeListItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = { expanded: false }
  }

  handleExpandClick = () => {
    this.setState((state) => ({ expanded: !state.expanded }))
  };

  render() {
    const {
      recipe,
      classes,
      ratings,
      priorities,
      updateRecipeTag,
      handleCommentModal,
    } = this.props
    const ingredientNames = Object.values(allIngredients(recipe)).map((ingredient) => (
      ingredient.tagName
    ))
    const { expanded } = this.state
    if (recipe.hidden) {
      return null
    }
    return (
      <Card className={classes.card}>
        <CardHeader
          title={<Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>}
          subheader={ingredientNames.join(', ')}
          action={(
            <RecipeHeaderActions
              ratings={ratings}
              priorities={priorities}
              rating={recipe.newRating || (recipe.ratings && recipe.ratings[0])}
              priority={recipe.newPriority || (recipe.priorities && recipe.priorities[0])}
              recipeId={recipe.id}
              recipeComment={recipe.newComment || (recipe.comments && recipe.comments[0]) || {}}
              updateRecipeTag={updateRecipeTag}
              handleCommentModal={handleCommentModal}
            />
          )}
        />
        <CardActions>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <RecipeProperties title="Ingredients" tags={allIngredients(recipe)} />
            <RecipeInstructions recipe={recipe} />
            <RecipeDescription recipe={recipe} />
          </CardContent>
        </Collapse>
      </Card>
    )
  }
}

RecipeListItem.propTypes = {
  recipe: PropTypes.shape({
    hidden: PropTypes.bool,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    newRating: PropTypes.shape({}),
    ratings: PropTypes.arrayOf(PropTypes.shape({})),
    newPriority: PropTypes.shape({}),
    priorities: PropTypes.arrayOf(PropTypes.shape({})),
    newComment: PropTypes.shape({}),
    comments: PropTypes.arrayOf(PropTypes.shape({})),
    ingredients: PropTypes.shape({}).isRequired,
  }),
  classes: PropTypes.shape({
    card: PropTypes.string,
    expand: PropTypes.string,
    expandOpen: PropTypes.string,
  }).isRequired,
  ratings: PropTypes.shape({}).isRequired,
  priorities: PropTypes.shape({}).isRequired,
  updateRecipeTag: PropTypes.func.isRequired,
  handleCommentModal: PropTypes.func.isRequired,
}

RecipeListItem.defaultProps = {
  recipe: {
    hidden: false,
  },
}

export default withStyles(styles)(RecipeListItem)
