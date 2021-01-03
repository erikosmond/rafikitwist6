# frozen_string_literal: true

require 'rails_helper'
require_relative '../../contexts/graph_index_context'

# rubocop: disable Metrics/BlockLength
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
  let(:index) { Graph::RecipeIndex.cache.hash }

  # TODO: make sure the associations of the recipe are `loaded?`
  it 'generates and returns the recipes index' do
    expect(index.values.map(&:name).sort).to eq [
      'Awesome Blossom',
      'Mai Tai',
      'Mashed Potatoes',
      'Pizza',
      'Pumpkin Pie',
      'Veggie Plate',
      'Veggie Soup',
      'almond milk',
      'orgeat',
      'pizza dough',
      'self-rising flour'
    ]
  end

  it 'loads recipes with associations' do
    # binding.pry
    expect(index.first.second.ingredients.first.amount).to eq '1 cup'
    expect(index.first.second.ingredients.first.name).to eq 'flour'
    expect(index.first.second.ingredients.first.modification_name).to eq 'bleached'
    expect(index.first.second.ingredients.first.modification_id).to eq bleached.id
    expect(index.first.second.ingredients.first.body).to eq 'sifted'
    expect(index.first.second.ingredients.first.id).to eq flour.id
  end
end
# rubocop: enable Metrics/BlockLength
