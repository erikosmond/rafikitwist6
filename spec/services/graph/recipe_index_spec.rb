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
  let(:index) { Graph::RecipeIndex.cache }

  # TODO: make sure the associations of the recipe are `loaded?`
  it 'generates and returns the recipes index' do
    expect(index.hash.values.map(&:name).sort).to eq [
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

  it 'assigns appropriate attributes' do
    index.reset
    expect(index.hash[self_rising_flour_recipe.id].ingredients.first.amount).to eq '1 cup'
    expect(index.hash[self_rising_flour_recipe.id].ingredients.first.name).to eq 'flour'
    expect(index.hash[self_rising_flour_recipe.id].ingredients.first.modification_name).
      to eq 'bleached'
    expect(index.hash[self_rising_flour_recipe.id].ingredients.first.modification_id).
      to eq bleached.id
    expect(index.hash[self_rising_flour_recipe.id].ingredients.first.body).to eq 'sifted'
    expect(index.hash[self_rising_flour_recipe.id].ingredients.first.id).to eq flour.id
  end

  it 'loads tag ids by type' do
    index.reset
    expect(index.hash[self_rising_flour_recipe.id].tag_ids_by_type).
      to eq({ 'vessels' => [bowl.id], 'sources' => [cook_book.id] })
  end

  it 'loads objective tag ids' do
    index.reset
    expect(index.hash[self_rising_flour_recipe.id].objective_tag_ids).
      to eq([flour.id, bowl.id, cook_book.id, baking_soda.id])
  end

  it 'loads filter tag ids' do
    index.reset
    binding.pry
    expect(index.hash[self_rising_flour_recipe.id].filter_tag_ids).
      to eq([flour.id, bowl.id, cook_book.id, baking_soda.id])
  end
end
# rubocop: enable Metrics/BlockLength
