# frozen_string_literal: true

module Graph
  # Ingredients as part of a recipe.
  class Ingredient
    delegate :body, to: :@tag_selection
    delegate :id, :name, to: :@tag

    def initialize(tag_selection, access)
      @tag_selection = tag_selection
      @tag = tag_selection.tag
      @access = access
      index_modifications
    end

    def amount
      @tag_selection.tag_attributes.find { |ta| ta.property == 'amount' }&.value
    end

    def modification_id
      modification&.id
    end

    def modification_name
      modification&.name
    end

    private

      def index_modifications
        return unless modification

        UserAccessModifiedTagIndex.instance.
          add_modifier_tag(@tag.id, modification_id, @access)
        UserAccessModificationTagIndex.instance.
          add_modification_tag(@tag.id, modification_id, @access)
      end

      def modification
        @tag_selection.modification_selections.first&.tag
      end
  end
end
