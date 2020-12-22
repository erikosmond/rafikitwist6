# frozen_string_literal: true

require 'rails_helper'
require_relative '../../contexts/graph_index_context'

describe UserAccessIndex do
  let(:recipe) { create(:recipe) }
  let(:tag_type) { create(:tag_type) }
  let(:user) { create(:user) }

  it 'generates and returns the user access index based on data from graphql_index_context' do
    uai = UserAccessIndex.new
    uai.generate
    expect(uai.user_access_index).to eq []
  end
end
