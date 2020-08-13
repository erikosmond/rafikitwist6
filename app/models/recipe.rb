# frozen_string_literal: true

# model for recipes table
class Recipe < ApplicationRecord
  include AssociatedRecipesService
  include RecipeTagsService

  has_many :tag_selections,
           -> { where(taggable_type: 'Recipe') },
           as: :taggable,
           dependent: :destroy,
           inverse_of: :taggable
  has_many :tags, through: :tag_selections, source: :tag, inverse_of: :recipes

  has_one :access, as: :accessible, dependent: :destroy

  has_one :ingredient, class_name: 'Tag'

  validates :name, presence: true
  validates :instructions, presence: true

  def ingredient_tag_selections
    types = ActiveRecord::Base.sanitize_sql(TagType::INGREDIENT_TYPES.join("', '"))
    tag_selections.joins(tag: :tag_type).where("tag_types.name IN ('#{types}')")
  end

  def ingredients_with_detail
    props_with_detail('Ingredient')
  end

  private

    def props_with_detail(name)
      tag_selections.left_outer_joins([:tag_attributes, tag: [:tag_type]]).
        left_outer_joins([:modifications]).
        select(props_with_detail_select).
        where('tag_types.name = ?', name).
        group_by(&:tag_id)
    end

    def props_with_detail_select
      [
        'tag_selections.id',
        'tags.name',
        'tag_selections.id AS tag_selection_id',
        'tags.id AS tag_id',
        'tag_attributes.value',
        'tag_attributes.property',
        'modifications_tag_selections.name AS modification_name'
      ]
    end
end
