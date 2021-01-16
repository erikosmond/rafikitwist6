# frozen_string_literal: true

module Graph
  # Singleton to index recipe ownership by user_id. user_id 0 are for public recipes.

  # TODO: almost definitely remove this, I don't think I'm using it
  class UserAccessRecipeIndex < Index
    private

      def generate_index
        recipes = Recipe.joins(:access).preload(:access)
        recipes.each_with_object(Hash.new { |hsh, key| hsh[key] = [] }) do |r, obj|
          if r.access.status == 'PUBLIC'
            obj[0] << r.id
          else
            obj[r.access.user_id] << r.id
          end
        end
      end
  end
end
