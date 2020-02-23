require 'rails_helper'

describe TagAttribute, type: :model do
  subject { create :tag_attribute }
  let(:tag) { create(:tag) }
  let(:tag_attr) { build(:tag_attribute, tag_attributable: tag, property: nil) }

  it 'has a valid factory' do
    expect(subject).to be_valid
  end

  it 'must have a property' do
    expect(tag_attr).not_to be_valid
  end

  describe 'unique scope validations' do
    let!(:ta1) { create(:tag_attribute, tag_attributable: tag, property: 'Same Prop') }
    let(:ta2) { build(:tag_attribute, tag_attributable: tag, property: 'Same Prop') }
    it 'validates unqiue property per tag attributable' do
      expect(ta2).not_to be_valid
    end
  end
end
