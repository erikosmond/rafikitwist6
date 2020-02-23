# frozen_string_literal: true

class TagSelection < ApplicationRecord
  has_many :tag_attributes, # i.e. Amount
           -> { where(tag_attributable_type: 'TagSelection') },
           as: :tag_attributable, dependent: :destroy
  has_many :modification_selections,
           -> { where(taggable_type: 'TagSelection') },
           class_name: 'TagSelection',
           as: :taggable,
           dependent: :destroy
  has_many :modifications, through: :modification_selections, source: :tag

  has_one :access, as: :accessible, dependent: :destroy

  belongs_to :tag,
             inverse_of: :tag_selections
  belongs_to :taggable,
             polymorphic: true,
             optional: true
  belongs_to :recipe,
             optional: true,
             foreign_key: 'taggable_id',
             foreign_type: 'taggable_type',
             class_name: 'Recipe'

  belongs_to :selected_recipe,
             optional: true,
             foreign_key: 'taggable_id',
             foreign_type: 'taggable_type',
             class_name: 'SelectedRecipe'

  belongs_to :tag_selection,
             optional: true,
             foreign_key: 'taggable_id',
             foreign_type: 'taggable_type',
             class_name: 'TagSelection'

  belongs_to :child_tag,
             foreign_key: 'tag_id',
             class_name: 'ChildTag'

  has_many :modified_recipes,
           through: :tag_selection,
           source: 'recipe'

  has_many :modified_tag_selections,
           through: :tag_selection,
           source: 'tag_selection'

  has_many :modified_tags,
           through: :tag_selection,
           source: 'tag'

  has_many :child_recipe_tags,
           through: :recipe

  validates :tag_id, presence: true
  validates :taggable_type, presence: true
  validates :taggable_id, presence: true
  validate :no_self_assignment

  accepts_nested_attributes_for :tag_attributes

  def no_self_assignment
    errors.add('Does not make sense to assign tag to itself') if taggable == tag
  end
end
