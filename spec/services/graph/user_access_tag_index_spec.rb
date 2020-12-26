# frozen_string_literal: true

require 'rails_helper'
require_relative '../../contexts/graph_index_context'

# rubocop: disable Metrics/BlockLength
# TODO: delete this test and class
describe Graph::UserAccessTagIndex do
  include_context 'graph_index_context'
  let(:tag_type) { create(:tag_type) }
  let(:expected_hash) do
    {
      0 => [
        one_star.id,
        five_star.id,
        high_priority.id,
        low_priority.id,
        smokey.id,
        grains.id,
        wheat.id,
        flour.id,
        water.id,
        baking_soda.id,
        self_rising_flour.id,
        pizza_dough.id,
        tomato.id,
        cheese.id,
        carrot.id,
        peas.id,
        potato.id,
        pumpkin.id,
        salt.id,
        pepper.id
      ],
      user1.id => [
        onion.id,
        clove.id
      ],
      user2.id => [
        plant_protein.id,
        nut.id,
        almond.id,
        sugar.id,
        almond_milk.id,
        orgeat.id,
        rum.id
      ]
    }
  end

  it 'generates and returns the user access recipes index' do
    expect(Graph::UserAccessTagIndex.cache.hash).to eq expected_hash
  end
end
# rubocop: enable Metrics/BlockLength
