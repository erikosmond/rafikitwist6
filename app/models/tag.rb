# frozen_string_literal: true

# Tags are how recipes are grouped and filtered. Types of tags include ingredient,
# recipe author (source), ratings, etc. By using a single table for all of these
# attributes, the filtering implementation on the front end is very simple. It
# also allows the creation of new types of tags through the product, without
# requiring code changes.

# Tags can associate with recipes, but they can also associate with other tags.
# For instance, 'egg white' is an ingredient, which is tagged by 'egg', which is an
# ingredient type, which is tagged by 'dairy', which is an ingredient category.
# But 'egg white', 'egg', and 'dairy' are all tags. This allows the user to filter by
# 'dairy', for instance, and see all the recipes that contain the 'dairy' tag, but
# also the 'egg' and 'egg white' tag.

class Tag < ApplicationRecord
  extend TagsService

  belongs_to :tag_type
  belongs_to :recipe, optional: true, inverse_of: :ingredient
  has_many :tag_attributes, # i.e. Brand, Year
           -> { where(tag_attributable_type: 'Tag') },
           as: :tag_attributable,
           dependent: :destroy

  has_many :tag_selections,
           dependent: :destroy
  has_many :recipes,
           through: :tag_selections,
           source: :taggable,
           source_type: 'Recipe'
  has_many :modified_tags,
           through: :tag_selections,
           source: :modified_tags
  # TODO: I think I can delete some of the associations below
  has_many :recipe_tag_selections,
           through: :recipes,
           source: :tag_selections

  # Tags that are assigned to this tag, like Ingredient Type for an Ingredient
  has_many :taggings,
           -> { where(taggable_type: 'Tag') },
           foreign_key: :taggable_id,
           foreign_type: 'Tag',
           class_name: 'TagSelection',
           dependent: :destroy
  has_many :parent_tags,
           through: :taggings,
           source: 'tag'

  has_one :access, as: :accessible, dependent: :destroy

  validates :name, presence: true
  validates_uniqueness_of :name, scope: :tag_type

  delegate :name, to: :tag_type, prefix: true

  def self.ingredient
    singleton_class::INGREDIENT
  end
end
