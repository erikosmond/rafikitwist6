# frozen_string_literal: true

require 'spec_helper'
require 'rails_helper'
require_relative '../contexts/recipe_context.rb'
require_relative '../contexts/tag_context.rb'

# rubocop: disable Metrics/BlockLength
describe Api::RecipesController, type: :controller do
  include_context 'recipes'
  let!(:user) { create(:user) }
  let!(:different_user) { create(:user) }
  let!(:no_data_user) { create(:user) }
  let!(:recipe) { create(:recipe) }
  let!(:rating_type) { create(:tag_type, name: 'Rating') }
  let!(:recipe_type) { create(:tag_type, name: 'RecipeType') }
  let!(:menu_type) { create(:tag_type, name: 'Been Made') }
  let!(:ingredient) { create(:tag, tag_type: tag_type_ingredient) }
  let!(:rating) { create(:tag, name: 'rating', tag_type: rating_type) }
  let!(:cocktail) { create(:tag, name: 'Cocktail', tag_type: recipe_type) }
  let!(:menu_tag) { create(:tag, name: 'menu', tag_type: menu_type) }
  let!(:tag_selection_ing) { create(:tag_selection, tag: ingredient, taggable: recipe) }
  let!(:tag_selection_rating) { create(:tag_selection, tag: rating, taggable: recipe) }
  let!(:tag_selection_cocktail) do
    create(:tag_selection, tag: cocktail, taggable: recipe)
  end
  let!(:tag_selection_menu) { create(:tag_selection, tag: menu_tag, taggable: recipe) }
  # let!(:access_ing) { create(:access, accessible: tag_selection_ing, user: user) }
  let!(:access_ing) do
    create(:access, accessible: tag_selection_ing, user: user, status: 'PUBLIC')
  end
  let!(:access_cocktail) do
    create(:access, accessible: tag_selection_cocktail, user: user, status: 'PUBLIC')
  end
  let!(:access_rating) do
    create(
      :access,
      accessible: tag_selection_rating,
      user: different_user,
      status: 'PRIVATE'
    )
  end
  let!(:access_rating) do
    create(:access, accessible: tag_selection_menu, user: user, status: 'PRIVATE')
  end
  let!(:access_recipe) do
    create(:access, accessible: recipe, user: user, status: 'PRIVATE')
  end
  let(:tag_subject) { create(:tag, name: 'Rice', tag_type: tag_type_ingredient_type) }

  describe 'GET - show' do
    before do
      sign_in user
      get :show,
          params: { id: recipe.id },
          format: 'json'
    end
    it 'returns a 200' do
      body = JSON.parse(response.body)
      expect(body['ingredients']["#{ingredient.id}mod"]['id']).to eq(tag_selection_ing.id)
      expect(body['ratings']).to be_nil
      expect(body['recipe_types'].first['tag_id']).to eq cocktail.id
    end
  end

  describe 'GET - show' do
    let!(:recipe_multi) { create(:recipe, name: 'Recipe Multi') }
    let!(:pineapple) { create(:tag, name: 'Pineapple', tag_type: tag_type_ingredient) }
    let!(:pineapple_selection2) do
      create(:tag_selection, taggable: recipe_multi, tag: pineapple, body: 'diced')
    end
    let!(:pineapple_selection1) do
      create(:tag_selection, taggable: recipe_multi, tag: pineapple)
    end
    let!(:modification_selection) do
      create(:tag_selection, taggable: pineapple_selection1, tag: modification)
    end
    let!(:pineapple_access1) { create(:access, accessible: recipe_multi) }
    let!(:access2) { create(:access, accessible: pineapple) }
    let!(:access3) { create(:access, accessible: pineapple_selection1) }
    let!(:access4) { create(:access, accessible: pineapple_selection2) }
    let!(:access5) { create(:access, accessible: modification_selection) }
    it 'returns multiple ingredients if they are of the same tag' do
      sign_in user
      get :show, params: { id: recipe_multi.id }, format: 'json'
      body = JSON.parse(response.body)

      expect(body['ingredients'].size).to eq(2)
    end
  end

  describe 'GET - edit' do
    before do
      sign_in user
      get :edit,
          params: { id: recipe.id },
          format: 'json'
    end
    it 'returns a 200' do
      body = JSON.parse(response.body)
      expect(body['instructions']).to eq(recipe.instructions)
    end
  end

  describe 'GET - index' do
    before do
      sign_in user
      get :index,
          params: { tag_id: tag_subject.id },
          format: 'json'
    end

    let(:filter_array) do
      [
        [lemon_verbena.id, 'Lemon Verbena'],
        [tag_subject.id, 'Rice'],
        [ingredient2.id, 'pepper'],
        [ingredient1.id, 'salt'],
        [ingredient1_type.id, 'spices'],
        [ingredient1_family.id, 'seasoning'],
        [modification.id, 'chili infused'],
        [source1.id, 'Erik'],
        [source2.id, 'Osmond']
      ]
    end

    it 'returns a 200' do
      expect(response.status).to eq(200)
    end
    it 'returns the tag id' do
      body = JSON.parse(response.body)
      expect(body['tag']['id']).to eq(tag_subject.id)
    end
    it 'returns the recipe details' do
      body = JSON.parse(response.body)
      expect(body['recipes'].size).to eq(2)
      expect(body['recipes'].map { |r| r['name'] } - ['Pizza', 'Chesnut Soup']).to eq([])
    end
    it 'returns the ingredients' do
      body = JSON.parse(response.body)
      pizza = body['recipes'].find { |r| r['name'] == 'Pizza' }
      expect(pizza['ingredients']["#{lemon_verbena.id}mod"]['tag_type']).
        to eq 'Ingredient'
      expect(pizza['ingredient_types'].first['tag_name']).to eq('Rice')
    end
    it 'returns the filter tags' do
      body = JSON.parse(response.body)
      expect(body['filter_tags'] - filter_array).to eq([])
    end
  end

  describe 'GET - index (modification)' do
    let(:tag_subject) do
      create(:tag, name: 'Chamomile', tag_type: tag_type_modifiction_type)
    end
    let!(:mod_selection) do
      create(:tag_selection, tag: tag_subject, taggable: tag_selection1)
    end

    let(:filter_array) do
      [
        [tag_subject.id, 'Chamomile'],
        [ingredient2.id, 'pepper'],
        [ingredient1.id, 'salt'],
        [ingredient1_type.id, 'spices'],
        [ingredient1_family.id, 'seasoning'],
        [modification.id, 'chili infused'],
        [lemon_verbena.id, 'Lemon Verbena'],
        [source1.id, 'Erik'],
        [source2.id, 'Osmond']
      ]
    end

    before do
      sign_in user
      get :index,
          params: { tag_id: tag_subject.id },
          format: 'json'
    end

    it 'returns a 200' do
      body = JSON.parse(response.body)
      expect(body['recipes'].size).to eq(2)
      expect(body['filter_tags'] - filter_array).to eq([])
      expect(response.status).to eq(200)
    end
  end

  describe 'GET - index for user with no recipe associations' do
    let(:tag_subject) do
      create(:tag, name: 'Chamomile', tag_type: tag_type_modifiction_type)
    end
    let!(:mod_selection) do
      create(:tag_selection, tag: tag_subject, taggable: tag_selection1)
    end

    before do
      sign_in no_data_user
      get :index,
          params: { tag_id: menu_tag.id },
          format: 'json'
    end

    it 'returns a 200' do
      body = JSON.parse(response.body)
      expect(body['recipes'].size).to eq(0)
      expect(response.status).to eq(200)
    end
  end

  describe 'GET - index (ingredient_type)' do
    before do
      sign_in user
      get :index,
          params: { tag_id: ingredient1_type.id },
          format: 'json'
    end

    it 'returns recipe details' do
      body = JSON.parse(response.body)
      expect(body['recipes'].size).to eq(1)
      expect(body['recipes'].first['ingredients'].keys.size).to eq(2)
    end
    it 'returns filter tags' do
      body = JSON.parse(response.body)
      expect(body['filter_tags'].size).to eq(8)
    end
  end

  describe 'GET - index (ingredient_family)' do
    before do
      sign_in user
      get :index,
          params: { tag_id: ingredient1_family.id },
          format: 'json'
    end

    it 'returns recipe details' do
      body = JSON.parse(response.body)
      expect(body['recipes'].size).to eq(1)
      expect(body['recipes'].first['ingredients'].keys.size).to eq(2)
    end
    it 'returns filter tags' do
      body = JSON.parse(response.body)
      expect(body['filter_tags'].size).to eq(8)
    end
  end

  describe 'GET - index (all recipes dropdown)' do
    before do
      sign_in user
      get :index,
          params: {},
          format: 'json'
    end

    it 'returns recipe names' do
      body = JSON.parse(response.body)
      expect(body['recipes'].size).to eq(3)
      expect(body['recipes'].first.keys.size).to eq(2)
    end
  end
end
# rubocop: enable Metrics/BlockLength
