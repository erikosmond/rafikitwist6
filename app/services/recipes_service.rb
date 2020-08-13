# frozen_string_literal: true

# Service for recipe related tasks
class RecipesService
  def initialize(recipe)
    @recipe = recipe
  end

  def recipe_as_ingredient
    tag = Tag.create!(
      name: @recipe.name,
      recipe_id: @recipe.id,
      tag_type_id: TagType.ingredient_id
    )
    add_parent_tags(tag)
    recipe_type_ingredient
    AccessService.create_access!(@recipe.access.user_id, tag)
  end

  private

    def add_parent_tags(tag)
      @recipe.parent_tags&.each do |parent_tag|
        ts = TagSelection.create!(tag_id: parent_tag.id, taggable: tag)
        AccessService.create_access!(@recipe.access.user_id, ts)
      end
    end

    def recipe_type_ingredient
      # TODO: add tests for this
      return if recipe.recipe_types.find { |t| t.id == Tag.ingredient_recipe_id }

      ts = TagSelection.create!(tag_id: Tag.ingreident_recipe_id, taggable: recipe)
      AccessService.create_access!(@recipe.access.user_id, ts)
    end
end
