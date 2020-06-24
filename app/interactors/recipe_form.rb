# frozen_string_literal: true

# class for handling params from recipes form
class RecipeForm < GeneralForm
  def call
    context.result = case context.action
                     when :create
                       create(context.params)
                     when :edit
                       edit(context.params)
                     when :update
                       update(context.params)
                     end
  end

  private

    def create(params)
      # TODO: initialize recipe and build all associations, then save
      recipe = create_recipe!(params)
      create_access(recipe)
      create_ingredients(params, recipe)
      create_tags(params, recipe)
      recipe
    end

    def create_recipe!(params)
      Recipe.create!(
        {
          name: params['recipe_name'],
          instructions: params['instructions'],
          description: params['description']
        }
      )
    end

    def create_ingredients(params, recipe)
      params['ingredients'].each do |i|
        create_ingredient_tag_selection(recipe, i)
      end
    end

    def create_ingredient_tag_selection(recipe, ing)
      ts = TagSelection.create!(
        taggable: recipe, tag_id: ing['ingredient']['value'], body: ing['ingredient_prep']
      )
      TagAttribute.create!(
        tag_attributable: ts, property: 'amount', value: ing['ingredient_amount']
      )
      create_access(ts)
      create_modification(ts, ing)
    end

    def create_modification(tag_selection, ingredient)
      return unless ingredient['ingredient_modification'] &&
                    ingredient['ingredient_modification']['value']

      ts = TagSelection.create!(
        taggable: tag_selection, tag_id: ingredient['ingredient_modification']['value']
      )
      create_access(ts)
    end

    def create_tags(params, recipe)
      tag_ids = form_tag_ids(params)
      tag_ids.each do |id|
        ts = TagSelection.create!(tag_id: id, taggable: recipe)
        create_access(ts)
      end
    end

    def form_tag_ids(params)
      tag_types.flat_map do |type|
        tag_ids_by_type(params[type])
      end.compact.uniq
    end

    def tag_types
      context.tag_types ||= TagType.all.reject do |tt| 
        TagType::INGREDIENT_TYPES.include? tt.name
      end.map(&:name).map(&:downcase).map(&:pluralize)
    end

    def tag_ids_by_type(tags)
      return unless tags&.first

      tags.map { |t| t['id'] }
    end

    def edit(params)
      recipe = params[:recipe]
      {
        id: recipe.id,
        description: recipe.description,
        instructions: recipe.instructions,
        recipe_name: recipe.name,
        ingredients: recipe.ingredient_tag_selections.map(&:recipe_form_ingredient)
      }.merge(property_tags(recipe))
    end
    
    def property_tags(recipe)
      recipe_dropdown = -> t { { id: t.id, name: t.name } }
      {
        sources: recipe.sources.map(&recipe_dropdown),
        vessels: recipe.vessels.map(&recipe_dropdown),
        recipe_types: recipe.recipe_types.map(&recipe_dropdown),
        menus: recipe.menus.map(&recipe_dropdown),
        preparations: recipe.preparations.map(&recipe_dropdown),
        flavors: recipe.flavors.map(&recipe_dropdown),
        components: recipe.components.map(&recipe_dropdown)
      }
    end

    def update(params)
      existing_recipe = params[:recipe]
      recipe_form = params[:form_fields]
      update_ingredients(existing_recipe, recipe_form)
      update_recipe_attrs(existing_recipe, recipe_form)
      update_recipe_tags(existing_recipe, recipe_form)
    end

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
      if tag_index
        ingredient_tag_selections.delete_at(tag_index)
      else
        nil
      end
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
        ts = TagSelection.create(taggable: ingredient_tag, tag_id: form_mod['value'])
        create_access(ts)
      end
    end

    def update_amount(ingredient_tag, form_ingredient, existing_amount)
      if existing_amount.present?
        existing_amount&.update(value: form_ingredient['ingredient_amount'])
      else
        TagAttribute.create(
          tag_attributable: ingredient_tag,
          property: 'amount',
          value: form_ingredient['ingredient_amount']
        )
      end
    end

    def delete_ingredients(ingredient_tag_selections, recipe, recipe_form)
      recipe_form_tag_ids = recipe_form['ingredients'].map do
        |ftag| ftag['ingredient']['value']
      end
      delete_ids = ingredient_tag_selections.select do |itag|
        recipe_form_tag_ids.exclude? itag.tag_id
      end.map(&:id)
      TagSelection.where(id: delete_ids).destroy_all
    end

    def update_recipe_attrs(record, form)
      record.update({
        name: form['recipe_name'],
        description: form['description'],
        instructions: form['instructions']
      })
    end

    def update_recipe_tags(record, form)
      non_ingredient_form_ids = get_form_tag_ids(form)
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
      tags.map(&:id) - tag_ids
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
        ts = TagSelection.create(tag_id: tag_id, taggable: record)
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
