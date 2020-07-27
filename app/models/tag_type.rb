# frozen_string_literal: true

# Includes class methods to allow easy checking of tag type in cache
class TagType < ApplicationRecord
  extend TagTypeService
  extend TagTypeCaching

  INGREDIENT_TYPES = %w[Ingredient IngredientType IngredientFamily].freeze

  has_many :tags, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
