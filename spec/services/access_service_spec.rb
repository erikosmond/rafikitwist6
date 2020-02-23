# frozen_string_literal: true

require 'rails_helper'

describe AccessService do
  let(:recipe) { create(:recipe) }
  let(:tag_type) { create(:tag_type) }
  let(:user) { create(:user) }

  it 'saves an access record for a recipe' do
    access = AccessService.create_access!(user.id, recipe)
    expect(access.persisted?).to be_truthy
  end

  it 'does not save an access record for a tag_type' do
    expect { AccessService.create_access!(user.id, tag_type) }.
      to raise_error(ArgumentError)
  end
end
