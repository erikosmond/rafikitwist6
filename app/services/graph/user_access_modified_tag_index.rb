# frozen_string_literal: true

module Graph
  # Singleton to index tags that have been modified in recipes.

  # IMPROVE: consider getting rid of this. Check recipes' ingredients for modifications (cached in a hash)
  class UserAccessModifiedTagIndex < Index
    def add_modifier_tag(modified_id, modifier_id, access)
      add_to_hash(modified_id, modifier_id, access)
    end

    def reset
      @hash = {} if Rails.env.test?
    end

    private

      def generate_index
        @hash || {}
      end
  end
end
