# frozen_string_literal: true

require 'rails_helper'

describe User, type: :model do
  subject { create :user }
  let!(:access) { create :access, user: subject }

  it 'has a valid factory' do
    expect(subject).to be_valid
  end

  it 'has accesses' do
    expect(subject.accesses).to eq([access])
  end
end
