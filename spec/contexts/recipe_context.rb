# frozen_string_literal: true

# rubocop: disable Metrics/BlockLength
RSpec.shared_context 'recipes', shared_context: :metadata do
  let(:modification_name) { 'chili infused' }
  let(:recipe1_name) { 'Pizza' }
  let(:recipe1_description) { 'New York Style' }
  let(:recipe2_name) { 'Chesnut Soup' }
  let(:recipe2_description) { 'Winter Warmer' }
  let(:recipe2_instructions) { 'Stir the soup' }
  let(:ingredient1_name) { 'salt' }
  let(:ingredient1_verbena) { 'Lemon Verbena' }
  let(:ingredient2_name) { 'pepper' }
  let(:ingredient1_type_name) { 'spices' }
  let(:ingredient1_family_name) { 'seasoning' }
  let(:source1_name) { 'Erik' }
  let(:source2_name) { 'Osmond' }
  let(:property) { 'Amount' }
  let(:value) { '1 ounce' }
  let(:pizza) { create(:recipe, name: recipe1_name, description: recipe1_description) }
  let(:soup) do
    create(
      :recipe,
      name: recipe2_name,
      description: recipe2_description,
      instructions: recipe2_instructions
    )
  end
  let(:tag_type_rating) { create(:tag_type, name: 'Rating') }
  let(:tag_type_ingredient) { create(:tag_type, name: 'Ingredient') }
  let(:tag_type_source) { create(:tag_type, name: 'Source') }
  let(:tag_type_ingredient_type) { create(:tag_type, name: 'IngredientType') }
  let(:tag_type_ingredient_family) { create(:tag_type, name: 'IngredientFamily') }
  let(:tag_type_not_ingredient) { create(:tag_type, name: 'NotIngredient') }
  let!(:tag_type_modifiction_type) { create(:tag_type, name: 'IngredientModification') }
  let(:alteration) { create(:tag_type, name: 'Alteration') }
  let(:lemon_verbena) do
    create(:tag, tag_type: tag_type_ingredient, name: ingredient1_verbena)
  end
  let(:rating) { create(:tag, tag_type: tag_type_rating, name: 'Rating: 9') }
  let(:ingredient1) do
    create(:tag, tag_type: tag_type_ingredient, name: ingredient1_name)
  end
  let(:ingredient1_type) do
    create(:tag, tag_type: tag_type_ingredient_type, name: ingredient1_type_name)
  end
  let(:ingredient1_family) do
    create(:tag, tag_type: tag_type_ingredient_family, name: ingredient1_family_name)
  end
  let(:ingredient1_unrelated) do
    create(:tag, tag_type: tag_type_not_ingredient, name: 'not related')
  end
  let(:ingredient2) do
    create(:tag, tag_type: tag_type_ingredient, name: ingredient2_name)
  end
  let(:source1) do
    create(:tag, tag_type: tag_type_source, name: source1_name)
  end
  let(:source2) do
    create(:tag, tag_type: tag_type_source, name: source2_name)
  end
  let(:modification) { create(:tag, tag_type: alteration, name: modification_name) }
  let(:tag_selection1) { create(:tag_selection, tag: tag_subject, taggable: pizza) }
  let!(:tag_selection1a) { create(:tag_selection, tag: lemon_verbena, taggable: pizza) }
  let!(:tag_selection2a) { create(:tag_selection, tag: tag_subject, taggable: soup) }
  let!(:tag_selection2b) { create(:tag_selection, tag: ingredient1, taggable: soup) }
  let!(:tag_selection2c) { create(:tag_selection, tag: ingredient2, taggable: soup) }
  let!(:tag_selection1s) { create(:tag_selection, tag: source1, taggable: soup) }
  let!(:tag_selection2s) { create(:tag_selection, tag: source2, taggable: soup) }
  let!(:tag_selection2ba) do
    create(:tag_selection, tag: ingredient1_type, taggable: ingredient1)
  end
  let!(:tag_selection2bb) do
    create(:tag_selection, tag: ingredient1_family, taggable: ingredient1_type)
  end
  let!(:tag_attribute) do
    create(
      :tag_attribute,
      property: property,
      value: value,
      tag_attributable: tag_selection2b
    )
  end
  let!(:tag_selection_mod) do
    create(:tag_selection, tag: modification, taggable: tag_selection2b)
  end
  let!(:user) { create(:user) }
  let!(:non_active_user) { create(:user) }
  let!(:access1a) { create(:access, user: user, accessible: pizza, status: 'PUBLIC') }
  let!(:access1b) do
    create(:access, user: user, accessible: tag_selection1, status: 'PRIVATE')
  end
  let!(:access1c) do
    create(:access, user: user, accessible: tag_selection1a, status: 'PUBLIC')
  end
  let!(:access1d) do
    create(:access, user: user, accessible: tag_selection2a, status: 'PUBLIC')
  end
  let!(:access1s) do
    create(:access, user: user, accessible: tag_selection1s, status: 'PUBLIC')
  end
  let!(:access2s) do
    create(:access, user: user, accessible: tag_selection2s, status: 'PUBLIC')
  end

  let!(:access3a) do
    create(:access, user: user, accessible: tag_selection2b, status: 'PUBLIC')
  end
  let!(:access3b) do
    create(:access, user: user, accessible: tag_selection2c, status: 'PUBLIC')
  end
  let!(:access3c) do
    create(:access, user: user, accessible: tag_selection2ba, status: 'PUBLIC')
  end
  let!(:access3d) do
    create(:access, user: user, accessible: tag_selection2bb, status: 'PUBLIC')
  end
  let!(:access3e) do
    create(:access, user: user, accessible: tag_selection_mod, status: 'PUBLIC')
  end

  let!(:access4a) do
    create(:access, user: user, accessible: lemon_verbena, status: 'PUBLIC')
  end

  let!(:access4b) do
    create(:access, user: user, accessible: ingredient1, status: 'PUBLIC')
  end

  let!(:access4c) do
    create(:access, user: user, accessible: ingredient2, status: 'PUBLIC')
  end

  let!(:access4d) do
    create(:access, user: user, accessible: source1, status: 'PUBLIC')
  end

  let!(:access4e) do
    create(:access, user: user, accessible: source2, status: 'PUBLIC')
  end

  let!(:access4f) do
    create(:access, user: user, accessible: ingredient1_type, status: 'PUBLIC')
  end

  let!(:access4g) do
    create(:access, user: user, accessible: ingredient1_family, status: 'PUBLIC')
  end

  let!(:access4h) do
    create(:access, user: user, accessible: modification, status: 'PUBLIC')
  end

  let!(:chestnut_soup_access) do
    create(:access, user: user, accessible: soup, status: 'PUBLIC')
  end
  let!(:recipes) { Graph::TagNode.new(tag_subject).api_response_recipes(user.id) }
end
# rubocop: enable Metrics/BlockLength
