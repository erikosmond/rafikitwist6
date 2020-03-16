# frozen_string_literal: true

require 'rails_helper'
require_relative '../contexts/basic_setup_context.rb'

# rubocop: disable Metrics/BlockLength
RSpec.describe RecipeByTag, type: :interactor do
  describe '.call' do
    include_context 'basic_setup'
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }
    let(:tag_type) { create(:tag_type, name: 'Menu') }
    let(:tag) { create(:tag, tag_type: tag_type, name: 'Been Made') }
    let(:shared_ingredient) do
      create(:tag, tag_type: ingredient_tag_type, name: 'avocado')
    end
    let(:ingredient_recipe1) do
      create(:tag, tag_type: ingredient_tag_type, name: 'star anise')
    end
    let(:ingredient_recipe2) { create(:tag, tag_type: ingredient_tag_type, name: 'sage') }
    let(:recipe1) { create(:recipe, name: 'pho') }
    let(:recipe2) { create(:recipe, name: 'stew') }
    let(:tag_selection1) { create(:tag_selection, tag: tag, taggable: recipe1) }
    let(:tag_selection2) { create(:tag_selection, tag: tag, taggable: recipe1) }
    let(:tag_selection3) { create(:tag_selection, tag: tag, taggable: recipe2) }
    let(:tag_selection4) do
      create(:tag_selection, tag: ingredient_recipe1, taggable: recipe1)
    end
    let(:tag_selection5) do
      create(:tag_selection, tag: shared_ingredient, taggable: recipe1)
    end
    let(:tag_selection6) do
      create(:tag_selection, tag: shared_ingredient, taggable: recipe2)
    end
    let(:tag_selection7) do
      create(:tag_selection, tag: ingredient_recipe2, taggable: recipe2)
    end
    let!(:access1) do
      create(:access, user: user, accessible: tag_selection1, status: 'PRIVATE')
    end
    let!(:access2) do
      create(:access, user: other_user, accessible: tag_selection2, status: 'PRIVATE')
    end
    let!(:access_r1) do
      create(:access, user: other_user, accessible: recipe1, status: 'PUBLIC')
    end
    let!(:access_r2) do
      create(:access, user: other_user, accessible: recipe2, status: 'PUBLIC')
    end
    let!(:access_t1) do
      create(:access, user: other_user, accessible: tag, status: 'PUBLIC')
    end
    let!(:access_t2) do
      create(:access, user: other_user, accessible: ingredient_recipe1, status: 'PUBLIC')
    end
    let!(:access_t3) do
      create(:access, user: other_user, accessible: ingredient_recipe2, status: 'PUBLIC')
    end
    let!(:access_t4) do
      create(:access, user: other_user, accessible: tag_selection4, status: 'PUBLIC')
    end
    let!(:access_t5) do
      create(:access, user: other_user, accessible: tag_selection5, status: 'PUBLIC')
    end
    let!(:access3) do
      create(:access, user: other_user, accessible: tag_selection3, status: 'PRIVATE')
    end
    let!(:access_t6) do
      create(:access, user: other_user, accessible: tag_selection6, status: 'PUBLIC')
    end
    let!(:access_t7) do
      create(:access, user: other_user, accessible: tag_selection7, status: 'PUBLIC')
    end

    let!(:result) do
      RecipeByTag.call(
        tag: tag,
        current_user: user
      )
    end
    it 'returns recipes only for that user' do
      expect(GroupRecipeDetail.call(recipe_details: result.result).result.count).to eq 1
      expect(GroupRecipeDetail.call(
        recipe_details: result.result
      ).result.first['name']).to eq 'pho'
    end
  end
end
# rubocop: enable Metrics/BlockLength
