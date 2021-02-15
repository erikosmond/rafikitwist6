# frozen_string_literal: true

module Graph
  # Singleton to index tags that have been used to modify other tags.

  # TODO: consider getting rid of this. Check recipes' ingredients for modifications (cached in a hash)
  # would have to update TagNode.mods_hash if removed
  class UserAccessModificationTagIndex < Index
    def add_modification_tag(modified_id, modifier_id, access)
      add_to_hash(modifier_id, modified_id, access)
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
