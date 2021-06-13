import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import styled from 'styled-components'

import Alert from 'containers/AlertContainer'
import CommentModal from 'containers/CommentModalContainer'
import TagFormModal from 'containers/TagFormModalContainer'
import TagFormSkeleton from 'containers/TagFormSkeletonContainer'
import RecipeSkeleton from 'containers/RecipeContainer'
import RecipeFormSkeleton from 'containers/RecipeFormSkeletonContainer'
import RecipeListSkeleton from 'containers/RecipeListSkeletonContainer'
import NavMenus from 'containers/NavMenusContainer'
import OuterWrapper from '../styled/OuterWrapper'

const StyledContent = styled.div`
  background-color: white;
`

const HeaderWrapper = styled.div`
    width: 100%;
    max-width: 1300px;
    position: flex;
    margin-left: auto;
    margin-right: auto;
    top: 0px;
    background-color: white;
    z-index: 1;
`

const LargeHome = () => (
  <Router>
    <OuterWrapper>
      <HeaderWrapper>
        <NavMenus />
      </HeaderWrapper>
    </OuterWrapper>
    <Alert />
    <CommentModal />
    <TagFormModal />

    <StyledContent>
      <Switch>
        <Route
          path="/tags/:tagId/recipes"
          component={RecipeListSkeleton}
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
          component={RecipeSkeleton}
        />
        <Route
          path="/"
          component={RecipeListSkeleton}
        />
      </Switch>
    </StyledContent>
  </Router>
)

export default LargeHome
