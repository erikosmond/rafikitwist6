# frozen_string_literal: true

require 'rails_helper'
require_relative '../contexts/basic_setup_context.rb'

RSpec.describe RecipeByTag, type: :interactor do
  describe '.call' do
    include_context 'basic_setup'
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }
    let(:tag_type) { create(:tag_type, name: 'Menu') }
    let(:tag) { create(:tag, tag_type: tag_type, name: 'Been Made') }
    let(:shared_ingredient) { create(:tag, tag_type: ingredient_tag_type, name: 'avocado') }
    let(:ingredient_recipe1) { create(:tag, tag_type: ingredient_tag_type, name: 'star anise') }
    let(:ingredient_recipe2) { create(:tag, tag_type: ingredient_tag_type, name: 'sage') }
    let(:recipe1) { create(:recipe, name: 'pho') }
    let(:recipe2) { create(:recipe, name: 'stew') }
    let(:tag_selection1) { create(:tag_selection, tag: tag, taggable: recipe1) }
    let(:tag_selection2) { create(:tag_selection, tag: tag, taggable: recipe1) }
    let(:tag_selection3) { create(:tag_selection, tag: tag, taggable: recipe2) }
    let(:tag_selection4) { create(:tag_selection, tag: ingredient_recipe1, taggable: recipe1) }
    let(:tag_selection5) { create(:tag_selection, tag: shared_ingredient, taggable: recipe1) }
    let(:tag_selection6) { create(:tag_selection, tag: shared_ingredient, taggable: recipe2) }
    let(:tag_selection7) { create(:tag_selection, tag: ingredient_recipe2, taggable: recipe2) }
    let!(:access1) { create(:access, user: user, accessible: tag_selection1, status: 'PRIVATE') }
    let!(:access2) { create(:access, user: other_user, accessible: tag_selection2, status: 'PRIVATE') }
    let!(:access_r1) { create(:access, user: other_user, accessible: recipe1, status: 'PUBLIC') }
    let!(:access_r2) { create(:access, user: other_user, accessible: recipe2, status: 'PUBLIC') }
    let!(:access_t1) { create(:access, user: other_user, accessible: tag, status: 'PUBLIC') }
    let!(:access_t2) { create(:access, user: other_user, accessible: ingredient_recipe1, status: 'PUBLIC') }
    let!(:access_t3) { create(:access, user: other_user, accessible: ingredient_recipe2, status: 'PUBLIC') }
    let!(:access_t4) { create(:access, user: other_user, accessible: tag_selection4, status: 'PUBLIC') }
    let!(:access_t5) { create(:access, user: other_user, accessible: tag_selection5, status: 'PUBLIC') }
    let!(:access3) { create(:access, user: other_user, accessible: tag_selection3, status: 'PRIVATE') }
    let!(:access_t6) { create(:access, user: other_user, accessible: tag_selection6, status: 'PUBLIC') }
    let!(:access_t7) { create(:access, user: other_user, accessible: tag_selection7, status: 'PUBLIC') }
    
    let!(:result) do
        RecipeByTag.call(
        tag: tag,
        current_user: user
      )
    end
    it 'returns recipes only for that user' do
        expect(GroupRecipeDetail.call(recipe_details: result.result).result.count).to eq 1
        expect(GroupRecipeDetail.call(recipe_details: result.result).result.first['name']).to eq 'pho'
    end
  end
end