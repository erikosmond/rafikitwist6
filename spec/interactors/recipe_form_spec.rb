# frozen_string_literal: true

require 'rails_helper'
require_relative '../contexts/tag_context.rb'

# rubocop: disable Metrics/BlockLength
RSpec.describe TagsByType, type: :interactor do
  describe '.call' do
  end
end

hi = {
  "recipe_name"=>"rname",
  "description"=>"rdesc",
  "instructions"=>"rinst",
  "ingredients"=> {"ingredient_amount"=>"2", "ingredient_prep"=>"diced", "ingredient_modification"=> {"label"=>"Ancho Chile infused", "value"=>346}, "ingredient"=>{"label"=>"Absinthe", "value"=>152}},
  "sources"=>[{"id"=>38, "name"=>"Erik Osmond"}, {"id"=>181, "name"=>"Hannah Infographic"}],
  "vessels"=>[{"id"=>37, "name"=>"Snifter"}],
  "recipe_types"=>[{"id"=>3, "name"=>"All Cocktails"}],
  "menus"=>[{"id"=>4, "name"=>"Been Made"}],
  "preparations"=>[{"id"=>5, "name"=>"Shaken"}],
  "flavors"=>[{"id"=>424, "name"=>"Spicy"}]
}
