require 'rails_helper'

describe TagType, type: :model do
  subject { create :tag_type }
  let!(:tag_type1) { create(:tag_type, name: 'Same Name')}
  let(:tag_type2) { build(:tag_type, name: 'Same Name')}

  it 'has a valid factory' do

    expect(subject).to be_valid
  end

  it 'validates a unique name' do
    expect(tag_type2).not_to be_valid
  end
end
