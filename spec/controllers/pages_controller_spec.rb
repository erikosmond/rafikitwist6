# frozen_string_literal: true

require 'spec_helper'
require 'rails_helper'

# rubocop: disable Metrics/BlockLength
describe PagesController, type: :controller do
  let!(:user) { create(:user) }
  let!(:recipe) { create(:recipe) }
  let!(:recipe2) { create(:recipe, name: 'recipe 2') }
  let!(:tag) { create(:tag) }

  let!(:ratings_type) { create(:tag_type, name: 'Rating') }
  let!(:rating_tag) { create(:tag, tag_type: ratings_type, name: 'new rating') }
  let!(:priority_type) { create(:tag_type, name: 'Priority') }
  let!(:priority_tag) { create(:tag, tag_type: priority_type, name: 'a priority') }
  let!(:ing_family_type) { create(:tag_type, name: 'IngredientFamily') }
  let!(:ing_type_type) { create(:tag_type, name: 'IngredientType') }
  let!(:tag_type_modifiction_type) { create(:tag_type, name: 'IngredientModification') }
  let!(:ing_type) { create(:tag_type, name: 'Ingredient') }
  let!(:family_tag) { create(:tag, tag_type: ing_family_type, name: 'fam tag') }
  let!(:type_tag) { create(:tag, tag_type: ing_type_type, name: 'type tag') }
  let!(:ing_tag) { create(:tag, tag_type: ing_type, name: 'ing type') }
  let!(:type_to_family) { create(:tag_selection, tag: family_tag, taggable: type_tag) }
  let!(:ing_to_type) { create(:tag_selection, tag: type_tag, taggable: ing_tag) }
  let!(:tag_selection) { create(:tag_selection, tag: ing_tag, taggable: recipe2) }
  let!(:family_tag_selection) do
    create(:tag_selection, tag: family_tag, taggable: recipe)
  end
  let!(:access1) { create(:access, accessible: family_tag_selection, user: user) }
  let!(:access2) { create(:access, accessible: tag_selection, user: user) }
  let!(:access3) { create(:access, accessible: type_to_family, user: user) }
  let!(:access4) { create(:access, accessible: ing_to_type, user: user) }
  let!(:access5) { create(:access, accessible: family_tag, user: user) }
  let!(:access6) { create(:access, accessible: type_tag, user: user) }
  let!(:access7) { create(:access, accessible: ing_tag, user: user) }
  let!(:all_tag_types) { TagType.all }
  let!(:all_tags) { Tag.all }
  let!(:tag_types_by_id) do
    {
      all_tag_types[0].id => all_tag_types[0].name,
      all_tag_types[1].id => all_tag_types[1].name,
      all_tag_types[2].id => all_tag_types[2].name,
      all_tag_types[3].id => all_tag_types[3].name,
      all_tag_types[4].id => all_tag_types[4].name,
      all_tag_types[5].id => all_tag_types[5].name,
      all_tag_types[6].id => all_tag_types[6].name
    }
  end
  let!(:tags_by_type) do
    {
      TagType.first.id => [Tag.first.id],
      TagType.second.id => [Tag.second.id],
      TagType.third.id => [Tag.third.id]
    }
  end
  let!(:tags_by_id) do
    {
      all_tags[0].id => all_tags[0].name,
      all_tags[1].id => all_tags[1].name,
      all_tags[2].id => all_tags[2].name,
      all_tags[3].id => all_tags[3].name,
      all_tags[4].id => all_tags[4].name,
      all_tags[5].id => all_tags[5].name
    }
  end
  let!(:tag_groups) do
    { family_tag.id => { type_tag.id => [ing_tag.id] } }
  end
  let(:recipe_index) { Graph::RecipeIndex.instance }
  let(:tag_index) { Graph::TagIndex.instance }

  describe 'GET - home' do
    before(:each) do
      TagType.delete_cache
    end
    before do
      sign_in user
      get :home,
          params: {
            tag_selection: {
              taggable_type: 'Recipe',
              taggable_id: recipe.id,
              tag_id: tag.id
            }
          },
          format: 'html'
    end

    it { expect(response.status).to eq(200) }

    it { expect(assigns[:all_tags]).to eq(tags_by_id) }
    it { expect(assigns[:home_tag_id]).to eq(tag.id) }
    it { expect(assigns[:all_tag_types]).to eq(tag_types_by_id) }
    it 'assigns tag groups' do
      tag_index.reset
      expect(assigns[:tag_groups]).to eq(tag_groups)
    end
    it { expect(assigns[:ratings]).to eq(rating_tag.name => rating_tag.id) }
    it { expect(assigns[:tags_by_type]).to eq(tags_by_type) }
    it { expect(assigns[:priorities]).to eq(priority_tag.name => priority_tag.id) }

    it { is_expected.to render_template :home }
  end
end
# rubocop: enable Metrics/BlockLength
