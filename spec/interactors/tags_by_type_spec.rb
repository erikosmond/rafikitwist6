# frozen_string_literal: true

require 'rails_helper'
require_relative '../contexts/tag_context'

# rubocop: disable Metrics/BlockLength
RSpec.describe TagsByType, type: :interactor do
  describe '.call' do
    include_context 'tags'
    let(:result) do
      TagsByType.call(
        tag_type: tag_type,
        current_user: user
      ).json
    end
    let(:ingredient_ids) do
      [
        nut.id,
        almond.id,
        protein.id,
        vodka.id
      ]
    end
    let(:not_ingredient_ids) do
      [
        toasted.id,
        crushed.id,
        plants.id
      ]
    end
    describe 'ingredients' do
      let(:tag_type) { 'ingredients' }
      it 'returns the correct number of tags for given type' do
        expect(result.size).to eq 4
      end
      it 'returns the correct tags for given type' do
        expect(result.map { |r| r['Value'] } - ingredient_ids).to eq []
      end
    end

    describe 'not ingredients' do
      let(:tag_type) { 'not ingredients' }
      it 'returns the correct number of tags for given type' do
        expect(result.size).to eq 3
      end
      it 'returns the correct tags for given type' do
        expect(result.map { |r| r['Value'] } - not_ingredient_ids).to eq []
      end
    end

    describe 'all tags' do
      let(:tag_type) { nil }
      it 'returns the correct number of tags for no type' do
        expect(result.size).to eq 7
      end
      it 'returns the correct tags for no type' do
        expect(result.map { |r| r['Value'] } - (not_ingredient_ids + ingredient_ids)).
          to eq []
      end
    end
  end
end
# rubocop: enable Metrics/BlockLength
