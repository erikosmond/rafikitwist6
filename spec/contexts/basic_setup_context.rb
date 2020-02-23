# frozen_string_literal: true

RSpec.shared_context 'basic_setup', shared_context: :metadata do
  let!(:ingredient_tag_type) { create(:tag_type, name: TagType::INGREDIENT) }
  let!(:ingredient_type_tag_type) { create(:tag_type, name: TagType::INGREDIENT_TYPE) }
  let!(:ingredient_family_tag_type) { create(:tag_type, name: TagType::INGREDIENT_FAMILY) }
  let!(:ingredient_mod_tag_type) { create(:tag_type, name: TagType::INGREDIENT_MODIFICATION) }
end
