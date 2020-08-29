# frozen_string_literal: true

# class for handling params from recipes form
class CreateRecipeForm < RecipeForm
  def create
    ActiveRecord::Base.transaction do
      recipe = create_recipe!
      create_access(recipe)
      create_ingredients(recipe)
      create_tags(recipe)
      recipe = recipe.tap(&:save!).reload
      RecipesService.new(recipe).recipe_as_ingredient(@params)
      recipe.reload
    end
  end

  private

    def create_recipe!
      Recipe.create!(
        {
          name: @params['recipe_name'],
          instructions: @params['instructions'],
          description: @params['description']
        }
      )
    end

    def create_ingredients(recipe)
      @params['ingredients'].each do |i|
        create_ingredient_tag_selection(recipe, i)
      end
    end

    def create_tags(recipe)
      tag_ids = get_form_tag_ids(@params)
      tag_ids.each do |id|
        ts = TagSelection.create!(tag_id: id, taggable: recipe)
        create_access(ts)
      end
    end

    def create_new_tags(tag_ids, record)
      tag_ids.each do |tag_id|
        ts = TagSelection.create!(tag_id: tag_id, taggable: record)
        create_access(ts, record.access.status)
      end
    end

    def delete_tag_selections(record, tag_ids)
      TagSelection.where(taggable: record, tag_id: tag_ids).destroy_all
    end
end
