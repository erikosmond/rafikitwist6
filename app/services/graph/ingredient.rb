# frozen_string_literal: true

module Graph
  # Ingredients as part of a recipe.
  class Ingredient
    delegate :body, to: :@tag_selection
    delegate :id, :name, to: :@tag

    def initialize(tag_selection)
      @tag_selection = tag_selection
      @tag = tag_selection.tag
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

      def modification
        @tag_selection.modification_selections.first&.tag
      end
  end
end
