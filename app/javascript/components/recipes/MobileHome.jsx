import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import styled from 'styled-components'

import Alert from 'containers/AlertContainer'
import CommentModal from 'containers/CommentModalContainer'
import MobileRecipeListSkeleton from 'containers/MobileRecipeListSkeletonContainer'
import TagFormModal from 'containers/TagFormContainer'
import TagFormSkeleton from 'containers/TagFormSkeletonContainer'
import RecipeSkeleton from 'containers/RecipeContainer'
import RecipeFormSkeleton from 'containers/RecipeFormSkeletonContainer'

const StyledContent = styled.div`
  margin-top: 1px;
`
const SmallHome = () => (
  <Router>
    <CommentModal />
    <TagFormModal />
    <Alert />

    <StyledContent>
      <Switch>
        <Route
          path="/tags/:tagId/recipes"
          component={MobileRecipeListSkeleton}
        />
        <Route
          path="/tags/:tagId/edit"
          render={() => <TagFormSkeleton edit />}
        />
        <Route
          path="/recipes/new"
          component={RecipeFormSkeleton}
        />
        <Route
          path="/recipes/:recipeId/edit"
          render={() => <RecipeFormSkeleton edit />}
        />
        <Route
          path="/recipes/:recipeId"
          render={() => <RecipeSkeleton mobile />}
        />
        <Route
          path="/"
          component={MobileRecipeListSkeleton}
        />
      </Switch>
    </StyledContent>
  </Router>
)

export default SmallHome
