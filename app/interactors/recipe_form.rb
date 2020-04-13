# frozen_string_literal: true

# class for handling params from recipes form
class RecipeForm
  include Interactor

  def call
    context.result = case context.action
                     when :create
                       create(context.params)
                     end
  end

  private

    def create(params)
      # TODO: initialize recipe and build all associations, then save
      recipe = create_recipe(params)
      create_recipe_access(recipe)
      create_ingredients(params, recipe)
      create_tags(params, recipe)
    end

    def create_recipe(params)
      Recipe.create!({
        name: params['recipe_name'],
        instructions: params['instructions'],
        description: params['description']
      })
    end

    def create_recipe_access(recipe)
      AccessService.create_access!(user_id, recipe, access_status)
    end

    def create_ingredients(params, recipe)
      params['ingredients'].each do |i|
        ts = TagSelection.create!(taggable: recipe, tag_id: i['ingredient']['value'], body: i['ingredient_prep'])
        TagAttribute.create!(tag_attribute: ts, property: 'amount', value: i['ingredient_amount'] )
        if i['ingredient_modifiction'] && i['ingredient_modifiction']['value']
          TagSelection.create!(taggable: ts, tag_id: i['ingredient_modification']['value'])
        end
      end
    end

    def create_tags(params, recipe)
      tag_ids = form_tag_ids(params)
      tag_ids.each do |id|
        TagSelection.create!(tag: id, taggable: recipe)
      end
    end

    def form_tag_ids(params)
      %w[sources vessels recipe_types menus preparations flavors].flat_map do |type|
        tag_ids_by_type(params[type])
      end.compact.uniq
    end

    def tag_ids_by_type(tags)
      return unless tags&.first

      tags.map { |t| t['id'] }
    end

    def access_status
      user_id == 1 ? 'PUBLIC' : 'PRIVATE'
    end

    def user_id
      context.user.id
    end
end
