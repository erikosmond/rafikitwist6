# frozen_string_literal: true

require 'rails_helper'
require_relative '../../contexts/graph_index_context'

# temp rubocop: disable Metrics/BlockLength
describe Graph::RecipeIndex do
  include_context 'graph_index_context'
  let(:expected_hash) do
    {
      0 => [
        self_rising_flour_recipe.id,
        pizza_dough_recipe.id,
        pizza.id,
        veggie_soup.id,
        veggie_plate.id
      ],
      user1.id => [
        pumpkin_pie.id, mashed_potatoes.id
      ],
      user2.id => [
        almond_milk_recipe.id, orgeat_recipe.id, awesome_blossom.id, mai_tai.id
      ]
    }
  end

  it 'generates and returns the recipes index' do
    expect(Graph::RecipeIndex.cache.hash).to eq expected_hash
  end
end
# temp rubocop: enable Metrics/BlockLength
