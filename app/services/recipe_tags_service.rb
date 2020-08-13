# frozen_string_literal: true

# Helper methods to for recipe details stored through tags association.
module RecipeTagsService
  def ingredients
    props('Ingredient')
  end

  def sources
    props('Source')
  end

  def vessels
    props('Vessel')
  end

  def menus
    props('Menu')
  end

  def preparations
    props('Preparation')
  end

  def flavors
    props('Flavor')
  end

  def recipe_types
    props('RecipeType')
  end

  def components
    props('Component')
  end

  def props(name)
    tags.joins(:tag_type).where('tag_types.name = ?', name)
  end
end
