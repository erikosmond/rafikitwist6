# frozen_string_literal: true

# Tag representations by user
class TagInteractor
  include Interactor

  def call
    return all_recipes unless context.tag_id.present?

    context.tag = Graph::TagIndex.instance.fetch(context.tag_id)
    context.result = if %(Priority Rating).include?(context.tag.tag_type.name) &&
                        context.current_user.present?
                       subjective_api_response
                     else
                       objective_api_resonse
                     end
  end

  private

    def all_recipes
      recipes = Graph::TagIndex.instance.all_by_user(context.current_user).map do |r|
        { 'Label' => r.name, 'Value' => r.id }
      end
      context.result = { tag: { name: 'All Recipes' }, recipes: recipes }
    end

    def api_response(recipes, tag_response = nil)
      {
        tag: tag_response || context.tag.api_response(user_id),
        recipes: recipes.map(&:api_response),
        filter_tags: filter_tags(recipes)
      }
    end

    def filter_tags(recipes)
      # TODO: pass user into filter_tag_ids method
      recipes.flat_map(&:filter_tag_ids).compact.uniq.map do |t_id|
        [t_id, Graph::TagIndex.instance.fetch(t_id).name]
      end
    end

    def objective_api_resonse
      return api_response([], {}) unless context.tag.viewable?(context.current_user)

      api_response(context.tag.user_recipes(context.current_user))
    end

    def subjective_api_response
      recipes = subjective_recipes.map do |recipe|
        Graph::RecipeIndex.instance.fetch(recipe.id)
      end
      api_resonse(recipes)
    end

    def subjective_recipes
      Recipe.joins(accesses: :tag).
        where("tags.id = #{context.tag.id.to_i}").
        where("accesses.user_id = #{user_id.to_i}").
        pluck(:id)
    end

    def user_id
      context.current_user&.id
    end
end
