# frozen_string_literal: true

require 'spec_helper'
require 'rails_helper'

# rubocop: disable Metrics/BlockLength
describe Api::TagSelectionsController, type: :controller do
  let!(:user) { create(:user) }
  let!(:recipe) { create(:recipe) }
  let!(:tag) { create(:tag, name: 'new tag') }
  let!(:old_tag) { create(:tag, name: 'old tag') }
  let!(:rating_tag_type) { create(:tag_type, name: 'Rating') }

  describe 'POST - create' do
    before do
      sign_in user
      post :create,
           params: {
             tag_selection: {
               taggable_type: 'Recipe',
               taggable_id: recipe.id,
               tag_id: tag.id
             }
           },
           format: 'json'
    end
    it 'returns a 200 and creates the record' do
      expect(response.status).to eq(200)
      expect(TagSelection.where(taggable: recipe, tag: tag).size).to eq 1
    end
  end

  describe 'PUT - update' do
    let!(:tag_selection) { create(:tag_selection, taggable: recipe, tag: old_tag) }
    before do
      sign_in user
      put :update,
          params: {
            id: tag_selection.id,
            tag_selection: {
              tag_id: tag.id,
              taggable_type: 'Recipe',
              taggable_id: recipe.id
            }
          },
          format: 'json'
    end
    it 'returns a 200 and updates the record' do
      expect(response.status).to eq(200)
      expect(TagSelection.find(tag_selection.id).tag).to eq tag
    end
  end
end
# rubocop: enable Metrics/BlockLength
