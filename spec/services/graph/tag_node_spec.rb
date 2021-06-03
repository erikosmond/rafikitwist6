# frozen_string_literal: true

require 'rails_helper'
require_relative '../../contexts/graph_index_context'

# rubocop: disable Metrics/BlockLength
describe Graph::RecipeIndex do
  include_context 'graph_index_context'

  let(:recipe_index) { Graph::RecipeIndex.instance }
  let(:tag_index) { Graph::TagIndex.instance }

  describe 'context' do
    before do
      recipe_index.reset
      tag_index.reset
    end

    it 'adds a parent tag id' do
      tn = tag_index.fetch(flour.id)
      tn.add_parent_tag_id(water.id)
      expect(tn.parent_tag_ids).to eq([wheat.id, water.id])
    end

    it 'adds a child tag id' do
      tn = tag_index.fetch(wheat.id)
      tn.add_child_tag_id(water.id)
      expect(tn.child_tag_ids).to eq([flour.id, water.id])
    end

    it 'shows filter tag ids' do
      tn = tag_index.fetch(self_rising_flour.id)
      expect(tn.filter_tag_ids.sort).to eq(
        [bowl.id, cook_book.id, bleached.id, grains.id, wheat.id,
         flour.id, baking_soda.id, self_rising_flour.id].sort
      )
    end

    it 'shows child tags by user' do
      tn = tag_index.fetch(nut.id)
      expect(tn.child_tags_by_user(user2).map(&:id).sort).to eq(
        [almond.id, cashew.id].sort
      )
    end

    it 'shows child tags by different user' do
      tn = tag_index.fetch(nut.id)
      expect(tn.child_tags_by_user(user1).map(&:id).sort).to eq(
        [cashew.id, hazelnut.id].sort
      )
    end

    it 'shows the recipe of a tag' do
      tn = tag_index.fetch(self_rising_flour.id)
      expect(tn.recipe.id).to eq(self_rising_flour_recipe.id)
    end

    it 'shows the recipe of a tag' do
      tn = tag_index.fetch(hazelnut.id)
      expect(tn.recipe).to eq(nil)
    end

    it 'shows the recipes the tag is found in' do
      tn = tag_index.fetch(wheat.id)
      expect(tn.recipes.map(&:id).sort).to eq([
        self_rising_flour_recipe.id, pizza_dough_recipe.id, pizza.id
      ].sort)
    end

    it 'shows the recipes the tag is found in by user' do
      tn = tag_index.fetch(almond.id)
      expect(tn.user_recipes(user2).map(&:id).sort).to eq([
        almond_milk_recipe.id, orgeat_recipe.id, mai_tai.id
      ].sort)
    end

    it 'shows no recipes the tag is found in by user' do
      tn = tag_index.fetch(almond.id)
      expect(tn.user_recipes(user1).map(&:id).sort).to eq([])
    end

    it 'shows the api_response the tag is found in by user' do
      tn = tag_index.fetch(almond.id)
      expect(tn.api_response(user2)).to eq(
        child_tags: {},
        description: 'white inside',
        grandchild_tags: {},
        grandparent_tags: { plant_protein.id => 'plant protein' },
        id: almond.id,
        modification_tags: { dry_roasted.id => 'dry roasted' },
        modified_tags: {},
        name: 'almond',
        parent_tags: { nut.id => 'nut' },
        recipe_id: nil,
        sister_tags: { cashew.id => 'cashew' },
        tag_type_id: ingredient_tag_type.id,
        tags: { almond.id => 'almond' }
      )
    end

    it 'shows the api_response_recipes the tag is found in by user' do
      tn = tag_index.fetch(almond.id)
      expect(tn.api_response_recipes(user2).map(&:id).sort).to eq([
        almond_milk_recipe.id, orgeat_recipe.id, mai_tai.id
      ].sort)
    end

    it 'shows modification tags from mods hash' do
      tn = tag_index.fetch(almond.id)
      expect(tn.mods_hash(user2)).to eq(
        { modification_tags: { dry_roasted.id => 'dry roasted' }, modified_tags: {} }
      )
    end

    it 'shows modified tags from mods hash' do
      tn = tag_index.fetch(dry_roasted.id)
      expect(tn.mods_hash(user2)).to eq(
        { modification_tags: {}, modified_tags: { almond.id => 'almond' } }
      )
    end
  end
end
# rubocop: enable Metrics/BlockLength
