# frozen_string_literal: true

RSpec.shared_context 'tag_types', shared_context: :metadata do
  let(:type_ingredient) { create :tag_type, name: 'Ingredient' }
  let(:type_source) { create :tag_type, name: 'Source' }
  let(:type_vessel) { create :tag_type, name: 'Vessel' }
  let(:type_preparation) { create :tag_type, name: 'Preparation' }
  let(:type_flavor) { create :tag_type, name: 'Flavor' }
  let(:type_menu) { create :tag_type, name: 'Menu' }
  let(:type_recipe_type) { create :tag_type, name: 'RecipeType' }
  let(:type_component) { create :tag_type, name: 'Component' }
  let(:type_ingredient_modification) { create :tag_type, name: 'IngredientModification' }
  let!(:recipe_book) { create :tag, name: 'Recipe Book', tag_type: type_source }
  let!(:recipe_website) { create :tag, name: 'Recipe Website', tag_type: type_source }
  let!(:coupe) { create :tag, name: 'Coupe', tag_type: type_vessel }
  let!(:snifter) { create :tag, name: 'Snifter', tag_type: type_vessel }
  let!(:shaken) { create :tag, name: 'Shaken', tag_type: type_preparation }
  let!(:sweet) { create :tag, name: 'Sweet', tag_type: type_flavor }
  let!(:home_bar) { create :tag, name: 'Home bar', tag_type: type_menu }
  let!(:mocktails) { create :tag, name: 'Mocktails', tag_type: type_recipe_type }
  let!(:crushed_ice) { create :tag, name: 'Crushed Ice', tag_type: type_component }
  let!(:simple_syrup) { create :tag, name: 'Simple Syrup', tag_type: type_ingredient }
  let!(:lime) { create :tag, name: 'Lime', tag_type: type_ingredient }
  let!(:club_soda) { create :tag, name: 'Club Soda', tag_type: type_ingredient }
  let!(:ancho_chili_infused) do
    create :tag, name: 'Ancho chili infused', tag_type: type_ingredient_modification
  end
  let!(:jalepeno_infused) do
    create :tag, name: 'Jalepeno infused', tag_type: type_ingredient_modification
  end
  let!(:juice_of) do
    create :tag, name: 'Juice of', tag_type: type_ingredient_modification
  end
end
