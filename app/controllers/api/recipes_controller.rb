# frozen_string_literal: true

module Api
  # Controller for recipes and recipes by tag
  class RecipesController < ApplicationController
    include RecipeControllerHelper
    def index
      tag_id = params.permit(:tag_id)[:tag_id]
      recipes = recipes_by_tag(tag_id)
      if recipes
        render json: recipes
      else
        render json: { tag_id: tag_id.to_s }, status: :not_found
      end
    end

    def show
      recipe = Recipe.find_by_id(params.permit(:id)[:id])
      if recipe&.tags&.first
        # Fetch all the universal recipe tags like ingredients, but also user
        # tags like ratings.
        detail = RecipeDetail.call(recipe: recipe, current_user: current_user)
        grouped_detail = GroupRecipeDetail.call(recipe_details: detail.result)
        render json: grouped_detail.result.first.merge(recipe.as_json)
      else
        render json: {}, status: :not_found
      end
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
      recipe = Recipe.find params.permit(:id)['id']
      if current_user.present? && Permissions.new(current_user).can_edit?(recipe)
        render json: RecipeForm.call(
          action: :edit, params: { recipe: recipe }, user: current_user
        ).result
      else
        render json: {}, status: :unauthorized
      end
    end

    def update
      recipe = Recipe.find update_recipe_params['id']
      if current_user.present? && Permissions.new(current_user).can_edit?(recipe)
        render json: RecipeForm.call(
          action: :update,
          params: { recipe: recipe, form_fields: update_recipe_params },
          user: current_user
        ).result
      else
        render json: {}, status: :unauthorized
      end
    end
  end
end
