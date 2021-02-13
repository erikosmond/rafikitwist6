# frozen_string_literal: true

# class for the postgres view for selected_recipes
class SelectedRecipe < Recipe
  # TODO: delete this file and the migration for the view
  self.table_name = 'selected_recipes'
end
