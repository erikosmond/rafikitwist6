# frozen_string_literal: true

require 'rails_helper'
require_relative '../../contexts/graph_index_context'

# rubocop: disable Metrics/BlockLength
describe 'UserAccessRecipeIndex#hash' do
  include_context 'graph_index_context'
  let(:tag_type) { create(:tag_type) }
  let(:expected_hash) do
    {
      0 => [
        self_rising_flour_recipe.id,
        pizza_dough_recipe.id, pizza.id,
        veggie_soup.id,
        veggie_plate.id
      ],
      user1.id => [
        orgeat_recipe.id, almond_milk_recipe.id, pumpkin_pie.id, mashed_potatoes.id
      ],
      user2.id => [awesome_blossom.id, mai_tai.id]
    }
  end

  it 'generates and returns the user access recipes index' do
    expect(Graph::UserAccessRecipeIndex.cache.hash).to eq expected_hash
  end
end
# rubocop: enable Metrics/BlockLength
