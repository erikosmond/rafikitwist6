# frozen_string_literal: true

module Graph
  # Singleton to index recipe ownership by user_id. user_id 0 are for public recipes.
  class RecipeIndex < Index
    @instance_mutex = Mutex.new

    private

      def generate_index
        {
          0 => [1, 2, 3],
          1 => [1, 2, 5]
        }
      end
  end
end
