# frozen_string_literal: true

require 'rails_helper'
require_relative '../contexts/tag_context.rb'

RSpec.describe BuildTagHierarchy, type: :interactor do
  describe '.call' do
    include_context 'tags'
    let(:result) do
      BuildTagHierarchy.call(
        tag: nut,
        current_user: user
      )
    end
    let(:expected_modifications) { [toasted.id, crushed.id, nil] }

    it "returns correct number of tag's parent and child tags" do
      expect(result.tags_with_hierarchy.size).to eq 3
    end
    it 'returns correct grandparent tag' do
      expect(result.tags_with_hierarchy.map(&:grandparent_tag_id).uniq).to eq [plants.id]
    end
    it 'returns correct parent tag' do
      expect(result.tags_with_hierarchy.map(&:parent_tag_id).uniq).to eq [protein.id]
    end
    it 'returns correct tag' do
      expect(result.tags_with_hierarchy.map(&:tag_id).uniq).to eq [nut.id]
    end
    it 'returns correct child tag' do
      expect(result.tags_with_hierarchy.map(&:child_tag_id).uniq).to eq [almond.id]
    end
    it 'returns correct modification tags' do
      expect(result.tags_with_hierarchy.map(&:modification_tag_id).uniq - expected_modifications).to eq []
    end
  end
end
