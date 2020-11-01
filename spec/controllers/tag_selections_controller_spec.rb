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

  describe 'POST - create a rating id when one already exists' do
    let!(:rating_tag1) { create(:tag, tag_type: rating_tag_type, name: '5 stars') }
    let!(:rating_tag2) { create(:tag, tag_type: rating_tag_type, name: '4 stars') }
    let!(:been_made_tag) { create(:tag, name: 'Been Made') }
    let!(:rating_tag_selection) do
      create(:tag_selection, tag: rating_tag1, taggable: recipe)
    end
    let!(:rating_tag_selection) do
      create(:tag_selection, tag: been_made_tag, taggable: recipe)
    end
    let!(:rating_access) { create(:access, user: user, accessible: rating_tag_selection) }
    before do
      sign_in user
      post :create,
           params: {
             tag_selection: {
               taggable_type: 'Recipe',
               taggable_id: recipe.id,
               tag_id: rating_tag2.id
             }
           },
           format: 'json'
    end
    it 'returns a 200 and creates the record' do
      expect(response.status).to eq(200)
      expect(TagSelection.where(taggable: recipe, tag: been_made_tag).size).to eq 1
    end
  end

  describe 'POST - create a rating id when one does not yet exist' do
    let!(:rating_tag1) { create(:tag, tag_type: rating_tag_type, name: '5 stars') }
    let!(:been_made_tag) { create(:tag, name: 'Been Made') }
    before do
      sign_in user
      post :create,
           params: {
             tag_selection: {
               taggable_type: 'Recipe',
               taggable_id: recipe.id,
               tag_id: rating_tag1.id
             }
           },
           format: 'json'
    end
    it 'returns a 200 and creates the record' do
      expect(response.status).to eq(200)
      expect(TagSelection.where(taggable: recipe, tag: been_made_tag).size).to eq 1
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
