# frozen_string_literal: true

# class for handling params from recipes form
class UpdateRecipeForm < RecipeForm
  def update
    ActiveRecord::Base.transaction do
      existing_recipe = params[:recipe]
      recipe_form = params[:form_fields]
      update_ingredients(existing_recipe, recipe_form)
      update_recipe_attrs(existing_recipe, recipe_form)
      update_recipe_tags(existing_recipe, recipe_form)
    end
    recipe = params[:recipe].reload
    Graph::RecipeIndex.instance.upsert(recipe)
    recipe
  end

  private

    def update_ingredients(record, recipe_form)
      ingredient_tag_selections = recipe_ingredient_tag_selections(record).to_a
      delete_ingredients(ingredient_tag_selections, record, recipe_form)
      recipe_form['ingredients'].each do |form_ingredient|
        tag_index = ingredient_tag_selections.index do |itag|
          itag.tag_id == form_ingredient['ingredient']['value']
        end
        tag_selection = removed_tag_selection(ingredient_tag_selections, tag_index)
        create_or_update_ingredient_tag(tag_selection, form_ingredient, record)
      end
    end

    def removed_tag_selection(ingredient_tag_selections, tag_index)
      ingredient_tag_selections.delete_at(tag_index) if tag_index
    end

    def create_or_update_ingredient_tag(tag_selection, form_ingredient, record)
      if tag_selection
        update_ingredient_tag(tag_selection, form_ingredient)
      else
        create_ingredient_tag_selection(record, form_ingredient)
      end
    end

    def update_ingredient_tag(tag_selection, form_ingredient)
      existing_amt = tag_selection.tag_attributes.find { |ta| ta.property == 'amount' }
      update_amount(tag_selection, form_ingredient, existing_amt)
      tag_selection.update(body: form_ingredient['ingredient_prep'])
      existing_modification = tag_selection.modification_selections.first
      form_mod = form_ingredient['ingredient_modification']
      update_modification(tag_selection, existing_modification, form_mod)
    end

    def update_modification(ingredient_tag, existing_modification, form_mod)
      return unless form_mod.present?

      if existing_modification.present?
        existing_modification.update(tag_id: form_mod['value'])
      else
        ts = TagSelection.create!(taggable: ingredient_tag, tag_id: form_mod['value'])
        create_access(ts)
      end
    end

    def update_amount(ingredient_tag, form_ingredient, existing_amount)
      if existing_amount.present?
        existing_amount&.update(value: form_ingredient['ingredient_amount'])
      else
        TagAttribute.create!(
          tag_attributable: ingredient_tag,
          property: 'amount',
          value: form_ingredient['ingredient_amount']
        )
      end
    end

    def delete_ingredients(ingredient_tag_selections, _recipe, recipe_form)
      recipe_form_tag_ids = recipe_form['ingredients'].map do |ftag|
        ftag['ingredient']['value']
      end
      delete_ids = ingredient_tag_selections.select do |itag|
        recipe_form_tag_ids.exclude? itag.tag_id
      end.map(&:id)
      TagSelection.where(id: delete_ids).destroy_all
    end

    def update_recipe_attrs(record, form)
      record.update(
        {
          name: form['recipe_name'],
          description: form['description'],
          instructions: form['instructions']
        }
      )
    end

    def update_recipe_tags(record, form)
      non_ingredient_form_ids = form_tag_ids(form)
      non_ingredient_tags = recipe_non_ingredient_tags(record)
      tag_ids_to_create = new_tags(non_ingredient_tags, non_ingredient_form_ids).compact
      tag_ids_to_delete = old_tags(non_ingredient_tags, non_ingredient_form_ids).compact
      create_new_tags(tag_ids_to_create, record)
      delete_tag_selections(record, tag_ids_to_delete)
    end

    def new_tags(tags, tag_ids)
      tag_ids - tags.map(&:id)
    end

    def old_tags(tags, tag_ids)
      tags.map(&:id) - tag_ids - Tag.subjective_tags.map(&:id)
    end

    def delete_tag_selections(record, tag_ids)
      TagSelection.where(taggable: record, tag_id: tag_ids).destroy_all
    end
end
