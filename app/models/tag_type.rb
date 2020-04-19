# frozen_string_literal: true

# Includes class methods to allow easy checking of tag type in cache
class TagType < ApplicationRecord
  extend TagTypeService

  INGREDIENT_TYPES = %w[Ingredient IngredientType IngredientFamily].freeze
  TAG_TYPES = 'tag_types'
  INGREDIENT_CATEGORY = 'IngredientCategory'
  INGREDIENT_FAMILY = 'IngredientFamily'
  INGREDIENT_TYPE = 'IngredientType'
  INGREDIENT_MODIFICATION = 'IngredientModification'
  INGREDIENT = 'Ingredient'
  RATING = 'Rating'

  has_many :tags, dependent: :destroy

  validates :name, presence: true, uniqueness: true

  def self.ingredient_category_id
    Rails.cache.fetch("#{TAG_TYPES}/category_id", expires_in: 1.year) do
      TagType.find_by_name(INGREDIENT_CATEGORY).id
    end
  end

  def self.family_id
    Rails.cache.fetch("#{TAG_TYPES}/family_id", expires_in: 1.year) do
      TagType.find_by_name(INGREDIENT_FAMILY).id
    end
  end

  def self.type_id
    Rails.cache.fetch("#{TAG_TYPES}/type_id", expires_in: 1.year) do
      TagType.find_by_name(INGREDIENT_TYPE).id
    end
  end

  def self.modification_id
    Rails.cache.fetch("#{TAG_TYPES}/modification_id", expires_in: 1.year) do
      TagType.find_by_name(INGREDIENT_MODIFICATION).id
    end
  end

  def self.ingredient_id
    Rails.cache.fetch("#{TAG_TYPES}/ingredient_id", expires_in: 1.year) do
      TagType.find_by_name(INGREDIENT).id
    end
  end

  def self.rating_id
    Rails.cache.fetch("#{TAG_TYPES}/rating_id", expires_in: 1.year) do
      TagType.find_by_name(RATING).id
    end
  end

  def self.delete_cache
    Rails.cache.delete_matched("#{TAG_TYPES}/*")
  end
end
