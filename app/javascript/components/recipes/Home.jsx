/* eslint-disable react/jsx-no-bind */

import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import styled from 'styled-components'

import CommentModal from 'containers/CommentModalContainer'
import RecipeSkeleton from 'containers/RecipeContainer'
import RecipeFormSkeleton from 'containers/RecipeFormContainer'
import RecipeList from 'containers/RecipeListContainer'
import RecipeHeader from 'containers/RecipeHeaderContainer'

const StyledContent = styled.div`
  margin-top: 70px;
`

const Home = () => (
  <Router>
    <div>
      <RecipeHeader />
      <CommentModal />
      <StyledContent>
        <Switch>
          <Route
            path="/tags/:tagId/recipes"
            component={RecipeList}
          />
          <Route
            path="/recipes/new"
            component={RecipeFormSkeleton}
          />
          <Route
            path="/recipes/:recipeId/edit"
            component={RecipeFormSkeleton}
          />
          <Route
            path="/recipes/:recipeId"
            component={RecipeSkeleton}
          />
          <Route
            path="/"
            component={RecipeList}
          />
        </Switch>
      </StyledContent>
    </div>
  </Router>
)

export default Home
