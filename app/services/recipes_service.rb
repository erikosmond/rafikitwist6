# frozen_string_literal: true

# Service for recipe related tasks
class RecipesService
  def initialize(recipe)
    @recipe = recipe
  end

  def recipe_as_ingredient(params)
    tag = Tag.create!(
      name: @recipe.name,
      recipe_id: @recipe.id,
      tag_type_id: TagType.ingredient_id,
      description: @recipe.description
    )
    add_parent_tags(tag, params)
    recipe_type_ingredient
    AccessService.create_access!(@recipe.access.user_id, tag)
  end

  private
    def add_parent_tags(tag, params)
      params['parent_tags']&.each do |parent_tag|
        ts = TagSelection.create!(tag_id: parent_tag['id'], taggable: tag)
        AccessService.create_access!(@recipe.access.user_id, ts)
      end
    end

    def recipe_type_ingredient
      return if @recipe.recipe_types.find { |t| t.id == Tag.ingreident_recipe_tag_id }

      ts = TagSelection.create!(tag_id: Tag.ingreident_recipe_tag_id, taggable: @recipe)
      AccessService.create_access!(@recipe.access.user_id, ts)
    end
end
