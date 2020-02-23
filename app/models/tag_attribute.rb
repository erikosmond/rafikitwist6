# frozen_string_literal: true

class TagAttribute < ApplicationRecord
  belongs_to :tag_attributable,
             polymorphic: true,
             inverse_of: :tag_attributes

  validates :property, presence: true

  validates_uniqueness_of :property,
                          scope: %i[tag_attributable_id tag_attributable_type]
end
