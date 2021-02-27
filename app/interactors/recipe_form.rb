# frozen_string_literal: true

# class for handling params from recipes form
class RecipeForm < GeneralForm
  attr_reader :context, :params

  def initialize(context)
    @context = context
    @params = context[:params]
    super
  end

  def call
    raise Error401, 'Not signed in' unless context.user.present?

    context.result = case context.action
                     when :create
                       CreateRecipeForm.new(context).create
                     when :edit
                       RecipeForm.new(context).edit
                     when :update
                       UpdateRecipeForm.new(context).update
                     end
  end

  def edit
    recipe = params[:recipe]
    {
      id: recipe.id,
      description: recipe.description,
      instructions: recipe.instructions,
      recipe_name: recipe.name,
      ingredients: recipe.ingredients.map(&:recipe_form_ingredient)
    }.merge(property_tags(recipe))
  end

  protected

    def property_tags(recipe)
      recipe_dropdown = ->(t) { { id: t.id, name: t.name } }

      {
        preparations: recipe.preparations.map(&recipe_dropdown),
        flavors: recipe.flavors.map(&recipe_dropdown),
        components: recipe.components.map(&recipe_dropdown)
      }.merge(recipe_attrs(recipe, recipe_dropdown))
    end

    def recipe_attrs(recipe, recipe_dropdown)
      {
        sources: recipe.sources.map(&recipe_dropdown),
        vessels: recipe.vessels.map(&recipe_dropdown),
        recipe_types: recipe.recipe_types.map(&recipe_dropdown),
        menus: recipe.menus.map(&recipe_dropdown)
      }
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

    def form_tag_ids(params)
      tag_types.flat_map do |type|
        tag_ids_by_type(params[type.underscore.pluralize])
      end.compact.uniq
    end

    def tag_types
      context.tag_types ||= TagType.all.reject do |tt|
        TagType::INGREDIENT_TYPES.include? tt.name
      end.map(&:name)
    end

    def tag_ids_by_type(tags)
      return unless tags&.first

      tags.map { |t| t['id'] }
    end

    def create_new_tags(tag_ids, record)
      tag_ids.each do |tag_id|
        ts = TagSelection.create!(tag_id: tag_id, taggable: record)
        create_access(ts, record.access.status)
      end
    end

    def recipe_non_ingredient_tags(recipe)
      recipe.tags.joins(:tag_type).where(tag_types: { name: tag_types })
    end

    def recipe_ingredient_tag_selections(recipe)
      recipe.tag_selections.joins(tag: :tag_type).
        where.not(tag_types: { name: tag_types })
    end
end
