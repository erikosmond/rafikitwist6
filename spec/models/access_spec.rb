require 'rails_helper'

describe Access, type: :model do
  subject { create :access }

  it 'has a valid factory' do
    expect(subject).to be_valid
  end

  it 'has a user' do
    expect(subject.user).to be_valid
  end

  it 'has an accessible' do
    expect(subject.accessible).to be_valid
  end
end
