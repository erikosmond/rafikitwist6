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
  # TODO: implement
  # def add_child_tag_id(id)


  # def filter_tag_ids


  # def grandparent_ids


  # def grandchild_tags_by_user(user)


  # def sister_tags_by_user(user)


  # def child_tags_by_user(user)


  # def recipe


  # def recipes


  # def user_recipes(user)


  # def api_response(user_id)


  # def api_response_recipes(user_id)


  # def mods_hash(user)
  end
end