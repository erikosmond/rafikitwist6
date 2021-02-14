# frozen_string_literal: true

# Fetch all tags related to a given recipe. This includes ingredients, vessels,
# sources, etc.
class RecipeDetail
  include AssociatedRecipesService
  include Interactor

  # def call
  #   context.result =
  #     context.recipe.tag_selections.
  #     select(recipes_select_tags + tag_details_select + tag_selections_attrs).
  #     left_outer_joins(detail_joins).
  #     where(
  #       "accesses.user_id =
  #       #{context.current_user&.id.to_i} OR accesses.status = 'PUBLIC'"
  #     )
  # end

  private

    # def detail_joins
    #   [
    #     { tag: :tag_type },
    #     :tag_attributes,
    #     :modifications,
    #     :access
    #   ]
    # end

    # def tag_selections_attrs
    #   ['tag_selections.id', 'tag_selections.body']
    # end
end
