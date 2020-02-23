# frozen_string_literal: true

require 'rails_helper'

describe Role, type: :model do
  subject { create :role }

  it 'has a valid factory' do
    expect(subject).to be_valid
  end

  describe 'validations' do
    let!(:role1) { create(:role, name: 'Same Name') }
    let!(:role2) { build(:role, name: 'Same Name') }
    it 'validates a unique name' do
      expect(role2).not_to be_valid
    end
  end
end
