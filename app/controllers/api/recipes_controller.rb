# frozen_string_literal: true

module Api
  # Controller for recipes and recipes by tag
  class RecipesController < ApplicationController
    include RecipeControllerHelper
    def index
      tag_id = params.permit(:tag_id)[:tag_id]
      # recipes = recipes_by_tag(tag_id)
      # render(json: TagInteractor.call(tag: tag, current_user: current_user))
      recipes = TagInteractor.call(tag_id: tag_id, current_user: current_user)
      # binding.pry
      if recipes.result
        render json: recipes.result
      else
        render json: { tag_id: tag_id.to_s }, status: :not_found
      end
    end

    def show
      # TODO: use graph
      recipe = Graph::RecipeIndex.instance.fetch(params.permit(:id)[:id])
      # recipe = Recipe.find_by_id(params.permit(:id)[:id])
      Permissions.new(current_user).can_view!(recipe)
      render json: recipe.subjective_api_response(current_user)
      # if recipe&.tags&.first
        # Fetch all the universal recipe tags like ingredients, but also user
        # tags like ratings.
        # detail = RecipeDetail.call(recipe: recipe, current_user: current_user)
        # grouped_detail = GroupRecipeDetail.call(recipe_details: detail.result)
        # render json: grouped_detail.result.first.merge(recipe.as_json)
      #   recipe.subjective_api_response(current_user)
      # else
      #   render json: {}, status: :not_found
      # end
    end

    def create
      recipe = RecipeForm.call(
        action: :create,
        params: params.permit(shared_columns),
        user: current_user
      )
      render json: recipe.result
    end

    def edit
      recipe = Recipe.find_by_id params.permit(:id)['id']
      Permissions.new(current_user).can_edit!(recipe)
      render json: RecipeForm.call(
        action: :edit, params: { recipe: recipe }, user: current_user
      ).result
    end

    def update
      recipe = Recipe.find_by_id update_recipe_params['id']
      Permissions.new(current_user).can_edit!(recipe)
      render json: RecipeForm.call(
        action: :update,
        params: { recipe: recipe, form_fields: update_recipe_params },
        user: current_user
      ).result
    end
  end
end
