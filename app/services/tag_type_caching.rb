# frozen_string_literal: true

# used for caching ids of frequently used tag types
module TagTypeCaching
  TAG_TYPES = 'tag_types'
  INGREDIENT_CATEGORY = 'IngredientCategory'
  INGREDIENT_FAMILY = 'IngredientFamily'
  INGREDIENT_TYPE = 'IngredientType'
  INGREDIENT_MODIFICATION = 'IngredientModification'
  INGREDIENT = 'Ingredient'
  RATING = 'Rating'

  def ingredient_category_id
    Rails.cache.fetch("#{TAG_TYPES}/category_id", expires_in: 1.year) do
      TagType.find_by_name(INGREDIENT_CATEGORY).id
    end
  end

  def family_id
    Rails.cache.fetch("#{TAG_TYPES}/family_id", expires_in: 1.year) do
      TagType.find_by_name(INGREDIENT_FAMILY).id
    end
  end

  def type_id
    Rails.cache.fetch("#{TAG_TYPES}/type_id", expires_in: 1.year) do
      TagType.find_by_name(INGREDIENT_TYPE).id
    end
  end

  def modification_id
    Rails.cache.fetch("#{TAG_TYPES}/modification_id", expires_in: 1.year) do
      TagType.find_by_name(INGREDIENT_MODIFICATION).id
    end
  end

  def ingredient_id
    Rails.cache.fetch("#{TAG_TYPES}/ingredient_id", expires_in: 1.year) do
      TagType.find_by_name(INGREDIENT).id
    end
  end

  def rating_id
    Rails.cache.fetch("#{TAG_TYPES}/rating_id", expires_in: 1.year) do
      TagType.find_by_name(RATING).id
    end
  end

  def delete_cache
    Rails.cache.delete_matched("#{TAG_TYPES}/*")
  end

  def ingredient_family() INGREDIENT_FAMILY end

  def ingredient_type() INGREDIENT_TYPE end

  def ingredient_modification() INGREDIENT_MODIFICATION end

  def ingredient() INGREDIENT end
end
