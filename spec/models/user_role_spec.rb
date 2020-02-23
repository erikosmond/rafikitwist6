# frozen_string_literal: true

require 'rails_helper'

describe UserRole, type: :model do
  subject { create :user_role }

  it 'has a valid factory' do
    expect(subject).to be_valid
  end

  it 'has a user' do
    expect(subject.user).to be_valid
  end

  it 'has a role' do
    expect(subject.role).to be_valid
  end

  describe 'validations' do
    let(:user) { create(:user) }
    let(:role) { create(:role) }
    let!(:ur1) { create(:user_role, user: user, role: role) }
    let(:ur2) { build(:user_role, user: user, role: role) }
    it 'should validate uniqueness of role by user' do
      expect(ur2).to_not be_valid
    end
  end
end
