# frozen_string_literal: true

# class for the postgres view for selected_recipes
class SelectedRecipe < Recipe
  self.table_name = 'selected_recipes'
end
