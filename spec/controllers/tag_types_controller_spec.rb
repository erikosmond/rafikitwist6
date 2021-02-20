# frozen_string_literal: true

require 'spec_helper'
require 'rails_helper'

require_relative '../contexts/tag_context'

describe Api::TagTypesController, type: :controller do
  before(:each) do
    TagType.delete_cache
  end
  include_context 'tags'

  describe 'GET - index' do
    before do
      sign_in user
      get :index, params: params, format: 'json'
    end

    context 'get grouped tag types' do
      let!(:params) { { grouped: true } }
      let!(:expected) do
        [
          { 'id' => almond.id, 'name' => 'Almond' },
          { 'id' => vodka.id, 'name' => 'Vodka' }
        ]
      end

      it 'responds with tag_groups' do
        body = JSON.parse(response.body)
        expect(body.keys.length).to eq 4
        expect(body['Ingredient'] - expected).to eq []
      end
    end
  end
end
