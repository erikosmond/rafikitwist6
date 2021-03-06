# frozen_string_literal: true

require 'spec_helper'
require 'rails_helper'
require_relative '../contexts/recipe_context'
require_relative '../contexts/tag_context'

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
  let!(:access_rating) do
    create(:access, accessible: rating, user: user, status: 'PUBLIC')
  end
  let!(:access_cocktail) do
    create(:access, accessible: tag_selection_cocktail, user: user, status: 'PUBLIC')
  end
  let!(:access_menu_tag) do
    create(:access, accessible: menu_tag, user: user, status: 'PRIVATE')
  end
  let!(:access_rating_sel) do
    create(
      :access,
      accessible: tag_selection_rating,
      user: different_user,
      status: 'PRIVATE'
    )
  end
  let!(:access_menu) do
    create(:access, accessible: tag_selection_menu, user: user, status: 'PRIVATE')
  end
  let!(:access_recipe) do
    create(:access, accessible: recipe, user: user, status: 'PRIVATE')
  end
  let(:tag_subject) { create(:tag, name: 'Rice', tag_type: tag_type_ingredient_type) }
  let!(:access_rice) do
    create(:access, accessible: tag_subject, user: user, status: 'PUBLIC')
  end
  let!(:access_ingredient) do
    create(:access, accessible: ingredient, user: user, status: 'PUBLIC')
  end
  let(:tag_index) { Graph::TagIndex.instance }
  let(:recipe_index) { Graph::RecipeIndex.instance }

  describe 'GET - show' do
    before do
      tag_index.reset
      recipe_index.reset
      sign_in user
      get :show,
          params: { id: recipe.id },
          format: 'json'
    end
    it 'returns a 200' do
      body = JSON.parse(response.body)
      expect(body['ingredients']["#{ingredient.id}mod"]['id']).to eq(tag_selection_ing.id)
      expect(body['ratings']).to eq []
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
      tag_index.reset
      recipe_index.reset
      sign_in user
      get :show, params: { id: recipe_multi.id }, format: 'json'
      body = JSON.parse(response.body)

      expect(body['ingredients'].size).to eq(2)
    end
  end

  describe 'GET - edit' do
    before do
      tag_index.reset
      recipe_index.reset
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
    before :each do
      tag_index.reset
      recipe_index.reset
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
    end
    it 'returns the filter tags' do
      body = JSON.parse(response.body)
      expect(body['filter_tags'].sort).to eq(filter_array.sort)
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
      tag_index.reset
      recipe_index.reset
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

  describe 'GET - index (rating)' do
    let(:expected_filter_tags) do
      [
        [ingredient.id, 'Mint'], [menu_tag.id, 'menu'], [rating.id, 'rating']
      ]
    end
    before do
      tag_index.reset
      recipe_index.reset
      sign_in different_user
      get :index,
          params: { tag_id: rating.id },
          format: 'json'
    end

    it 'returns a 200' do
      body = JSON.parse(response.body)
      expect(body['recipes'].size).to eq(1)
      expect(body['recipes'].first['name']).to eq(recipe.name)
      expect(body['filter_tags'] - expected_filter_tags).to eq([])
    end
  end

  describe 'GET - index (no rating)' do
    before do
      tag_index.reset
      recipe_index.reset
      sign_in user
      get :index,
          params: { tag_id: rating.id },
          format: 'json'
    end

    it 'returns a 200' do
      body = JSON.parse(response.body)
      expect(body['recipes'].size).to eq(0)
      expect(response.status).to eq(200)
    end
  end

  describe 'GET - index for user with no recipe associations' do
    before do
      tag_index.reset
      recipe_index.reset
      sign_in no_data_user
      get :index,
          params: { tag_id: menu_tag.id },
          format: 'json'
    end

    it 'returns a 403' do
      expect(response.status).to eq(403)
    end
  end

  describe 'GET - index (ingredient_type)' do
    before do
      tag_index.reset
      recipe_index.reset
      sign_in user
      get :index,
          params: { tag_id: ingredient1_type.id },
          format: 'json'
    end

    it 'returns recipe details' do
      body = JSON.parse(response.body)
      expect(body['recipes'].size).to eq(1)
      expect(body['recipes'].first['ingredients'].keys.size).to eq(3)
    end
    it 'returns filter tags' do
      body = JSON.parse(response.body)
      expect(body['filter_tags'].size).to eq(8)
    end
  end

  describe 'GET - index (ingredient_family)' do
    before do
      tag_index.reset
      recipe_index.reset
      sign_in user
      get :index,
          params: { tag_id: ingredient1_family.id },
          format: 'json'
    end

    it 'returns recipe details' do
      body = JSON.parse(response.body)
      expect(body['recipes'].size).to eq(1)
      expect(body['recipes'].first['ingredients'].keys.size).to eq(3)
    end
    it 'returns filter tags' do
      body = JSON.parse(response.body)
      expect(body['filter_tags'].size).to eq(8)
    end
  end

  describe 'GET - index (all recipes dropdown)' do
    before do
      tag_index.reset
      recipe_index.reset
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
