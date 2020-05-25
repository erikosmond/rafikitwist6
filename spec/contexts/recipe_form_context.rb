# frozen_string_literal: true

RSpec.shared_context 'recipe_form', shared_context: :metadata do
  let(:recipe) do
    create :recipe, name: 'Recipe with everything', description: 'very yummy'
  end
  let(:recipe_user) { create :user }
  let!(:recipe_access) { create :access, user: recipe_user, accessible: recipe }
  let!(:ts1) { create :tag_selection, taggable: recipe, tag: recipe_book }
  let!(:ts2) { create :tag_selection, taggable: recipe, tag: recipe_website }
  let!(:ts3) { create :tag_selection, taggable: recipe, tag: coupe }
  let!(:ts4) { create :tag_selection, taggable: recipe, tag: shaken }
  let!(:ts5) { create :tag_selection, taggable: recipe, tag: sweet }
  let!(:ts6) { create :tag_selection, taggable: recipe, tag: home_bar }
  let!(:ts7) { create :tag_selection, taggable: recipe, tag: mocktails }
  let!(:ts8) { create :tag_selection, taggable: recipe, tag: crushed_ice }
  let!(:ingredient_ts) do
    create :tag_selection, taggable: recipe, tag: simple_syrup, body: 'minced'
  end
  let!(:modification_ts) do
    create :tag_selection, taggable: ingredient_ts, tag: ancho_chili_infused
  end
  let!(:tag_attribute) do
    create :tag_attribute, tag_attributable: ingredient_ts, property: 'amount', value: 2
  end
end
