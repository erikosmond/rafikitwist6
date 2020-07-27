# frozen_string_literal: true

# Service for recipe related tasks
class RecipesService
  def self.recipe_as_ingredient(recipe)
    tag = Tag.create!(
      name: recipe.name,
      recipe_id: recipe.id,
      tag_type_id: TagType.ingredient_id
    )
    AccessService.create_access!(recipe.access.user_id, tag)
  end
end
