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
      RecipesService.new(recipe).recipe_as_ingredient if @params['isIngredient'].present?
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
      tag_ids = form_tag_ids
      tag_ids.each do |id|
        ts = TagSelection.create!(tag_id: id, taggable: recipe)
        create_access(ts)
      end
    end

    def form_tag_ids
      tag_types.flat_map do |type|
        tag_ids_by_type(@params[type])
      end.compact.uniq
    end

    def tag_ids_by_type(tags)
      return unless tags&.first

      tags.map { |t| t['id'] }
    end

    def recipe_non_ingredient_tags(recipe)
      recipe.tags.joins(:tag_type).where(tag_types: { name: tag_types })
    end

    def recipe_ingredient_tag_selections(recipe)
      recipe.tag_selections.joins(tag: :tag_type).
        where.not(tag_types: { name: tag_types })
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

    def get_form_tag_ids(form)
      tag_types.compact.flat_map do |tt|
        tags = form[tt]
        next unless tags

        tags.map { |t| t['id'] }
      end
    end
end
