# frozen_string_literal: true

# rubocop: disable Metrics/BlockLength
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
  let!(:shaken) { create :tag, name: 'Shaken', tag_type: type_preparation }
  let!(:sweet) { create :tag, name: 'Sweet', tag_type: type_flavor }
  let!(:home_bar) { create :tag, name: 'Home bar', tag_type: type_menu }
  let!(:mocktails) { create :tag, name: 'Mocktails', tag_type: type_recipe_type }
  let!(:crushed_ice) { create :tag, name: 'Crushed Ice', tag_type: type_component }
  let!(:simple_syrup) { create :tag, name: 'Simple Syrup', tag_type: type_ingredient }
  let!(:club_soda) { create :tag, name: 'Club Soda', tag_type: type_ingredient }
  let!(:ancho_chili_infused) do
    create :tag, name: 'Ancho chili infused', tag_type: type_ingredient_modification
  end
end

# {recipe_name: "rname", description: "rdesc", instructions: "rins",…}

# recipe_name: "rname"
# description: "rdesc"
# instructions: "rins"
# ingredients: [{ingredient_amount: "2", ingredient_modification: {label: "Anise-infused", value: 616},…},…]
# 0: {ingredient_amount: "2", ingredient_modification: {label: "Anise-infused", value: 616},…}
# 1: {ingredient_amount: "3", ingredient: {label: "Acacia Honey", value: 127}}
# sources: [{id: 38, name: "Erik Osmond"}, {id: 53, name: "Death and Co Classics"}]
# vessels: [{id: 7, name: "V martini"}]
# recipe_types: [{id: 3, name: "All Cocktails"}]
# menus: [{id: 4, name: "Been Made"}]
# preparations: [{id: 5, name: "Shaken"}]
# flavors: [{id: 424, name: "Spicy"}]
# components: [{id: 78, name: "Crushed Ice"}]

# RecipeType: [{id: 3, name: "All Cocktails"}, {id: 661, name: "Mocktail"}]
# Menu: [{id: 4, name: "Been Made"}, {id: 6, name: "Retox"}, {id: 35, name: "Menu"},…]
# Preparation: [{id: 5, name: "Shaken"}, {id: 99, name: "Stirred"}, {id: 683, name: "Built"}]
# Vessel: [{id: 7, name: "V martini"}, {id: 37, name: "Snifter"}, {id: 52, name: "Champagne flute"},…]
# Source: [{id: 8, name: "Mayahuel"}, {id: 38, name: "Erik Osmond"}, {id: 53, name: "Death and Co Classics"},…]
# IngredientCategory: [{id: 9, name: "Spirit"}, {id: 18, name: "Produce"}, {id: 47, name: "Liqueur"}, {id: 58, name: "Wine"},…]
# IngredientFamily: [{id: 10, name: "Mezcal"}, {id: 14, name: "Tequila"}, {id: 19, name: "Fruit"},…]
# IngredientType: [{id: 11, name: "Blanco or Joven Mezcal"}, {id: 15, name: "Blanco, plata, platinum or white Tequila"},…]
# Ingredient: [{id: 12, name: "Del Maguey Vida Mezcal"}, {id: 16, name: "Siembra Azul Blanco Tequila"},…]
# IngredientModification: [{id: 13, name: "Chile de Arbol infused"}, {id: 17, name: "Jalepeno infused"},…]
# Components: [{id: 78, name: "Crushed Ice"}, {id: 335, name: "Booze Only"}]
# Rating: [{id: 36, name: "4 stars"}, {id: 142, name: "1 star"}, {id: 129, name: "2 stars"},…]
# Priority: [{id: 2, name: "High priority"}, {id: 98, name: "On Deck"}, {id: 123, name: "Highest priority"},…]
# Flavor: [{id: 424, name: "Spicy"}]
# Comment: [{id: 696, name: "Comment"}]