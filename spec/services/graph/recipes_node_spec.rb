# frozen_string_literal: true

require 'rails_helper'
require_relative '../../contexts/graph_index_context'

# rubocop: disable Metrics/BlockLength
describe Graph::RecipeNode do
  include_context 'graph_index_context'

  let(:recipe_index) { Graph::RecipeIndex.instance }
  let(:tag_index) { Graph::TagIndex.instance }

  let(:comment_ts) { create(:tag_selection, tag: comment_tag, body: 'yummy') }
  let(:priority_ts) { create(:tag_selection, tag: high_priority) }
  let(:rating_ts) { create(:tag_selection, tag: five_star) }

  describe 'context' do

    before do
      recipe_index.reset
      tag_index.reset
    end
    it 'generates and returns filter_tag_ids' do
      rn = recipe_index.fetch(self_rising_flour_recipe.id)
      expect(rn.filter_tag_ids.sort).to eq [
        flour.id, wheat.id, bowl.id, cook_book.id, bleached.id, grains.id, baking_soda.id
      ].sort
    end

    it 'generates and returns filter_tag_hash' do
      rn = recipe_index.fetch(self_rising_flour_recipe.id)
      expect(rn.filter_tag_hash).to eq({
        flour.id => true,
        wheat.id => true,
        bowl.id => true,
        cook_book.id => true,
        bleached.id => true,
        grains.id => true,
        baking_soda.id => true
      })
      
    end

    it 'contains id true when present' do
      rn = recipe_index.fetch(self_rising_flour_recipe.id)
      expect(rn.contains_tag_id?(flour.id)).to eq true
    end

    it 'contains id false when not present' do
      rn = recipe_index.fetch(self_rising_flour_recipe.id)
      expect(rn.contains_tag_id?(flour.id + 1000)).to be_falsey
    end

    it 'contains id false when not present' do
      rn = recipe_index.fetch(self_rising_flour_recipe.id)
      expect(rn.contains_tag_id?(flour.id + 1000)).to be_falsey
    end

    it 'adds comment to the api response' do
      # comments (and all subjective tags) are only added to copies of recipe nodes 
      # that are about to be included in an api response, which has happened before 
      # calling this method. This is why there's no need to pass in a user id here
      rn = recipe_index.fetch(self_rising_flour_recipe.id)
      hash = {
        id: comment_ts.id,
        tag_id: comment_ts.tag_id,
        body: comment_ts.body,
        tag_name: comment_ts.tag.name
      }
      rn.append_comment_tag_hash_array(hash)
      expect(rn.api_response[:comments]).to eq(
        [{ body: 'yummy', id: comment_ts.id, tag_id: comment_tag.id, tag_name: 'Comment' }]
      )
    end

    it 'addes priority to the api response' do
      rn = recipe_index.fetch(self_rising_flour_recipe.id)
      hash = {
        id: priority_ts.id,
        tag_id: priority_ts.tag_id,
        tag_name: priority_ts.tag.name
      }
      rn.append_priority_tag_hash_array(hash)
      expect(rn.api_response[:priorities]).to eq(
        [{ id: priority_ts.id, tag_id: high_priority.id, tag_name: 'high priority' }]
      )
    end

    it 'addes rating to the api response' do
      rn = recipe_index.fetch(self_rising_flour_recipe.id)
      hash = {
        id: rating_ts.id,
        tag_id: rating_ts.tag_id,
        tag_name: rating_ts.tag.name
      }
      rn.append_rating_tag_hash_array(hash)
      expect(rn.api_response[:ratings]).to eq(
        [{ id: rating_ts.id, tag_id: five_star.id, tag_name: '5 star' }]
      )
    end

    it 'returns appropriate response for the api on objective tag' do
      rn = recipe_index.fetch(self_rising_flour_recipe.id)
      expect(rn.api_response).to eq(
        {
          "sources" => [{ tag_id: cook_book.id, tag_name: 'Cook Book' }],
          "vessels" => [{ tag_id: bowl.id, tag_name: 'bowl' }],
          comments: [],
          description: 'pre-mixed',
          id: self_rising_flour_recipe.id,
          ingredients: {
            "#{flour.id}mod#{bleached.id}" => {
              body: 'sifted', id: srf1_ing1.id, modification_id: bleached.id,
              modification_name: 'bleached', property: 'amount',
              tag_description: 'powdery', tag_id: flour.id, tag_name: 'flour',
              tag_type: 'Ingredient', tag_type_id: ingredient_tag_type.id, value: '1 cup'
            },
            "#{baking_soda.id}mod" => {
              body: nil, id: srf1_ing2.id, modification_id: nil, modification_name: nil,
              property: 'amount', tag_description: nil, tag_id: baking_soda.id,
              tag_name: 'baking soda', tag_type: 'Ingredient',
              tag_type_id: ingredient_tag_type.id, value: nil
            }
          },
          instructions: "Layer everything together",
          name: "self-rising flour",
          priorities: [],
          ratings: [],
          tag_ids: {
            cook_book.id => true, bowl.id => true, flour.id => true, bleached.id => true,
            baking_soda.id => true, wheat.id => true, grains.id => true
          }
        }
      )
    end

    it 'copies a recipe node' do
      rn = recipe_index.fetch(self_rising_flour_recipe.id)
      rnc = rn.copy
      expect(rn.name).to eq(rnc.name)
      expect(rn.tags).to eq(rnc.tags)
      expect(rn).not_to eq(rnc)
    end
  end
end
