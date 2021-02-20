# frozen_string_literal: true

# methods mostly used to build tag heirarchy to populate filtering component.
module TagsService
  COMMENT_TAG_NAME = 'Comment'
  TAGS = 'Tags'
  INGREDIENT = 'Ingredient'
  SUBJECTIVE_TAG_TYPES = %w[Priority Rating Comment].freeze

  def comment_tag
    tag = Tag.find_or_initialize_by(name: COMMENT_TAG_NAME)
    return tag if tag.persisted?

    tag_type = TagType.find_or_create_by(name: COMMENT_TAG_NAME)
    tag.tag_type = tag_type
    tag.tap(&:save).reload
  end

  def tags_by_type
    # TODO: refactor to use graph code
    ingredient_and_comment_types = TagType::INGREDIENT_TYPES +
                                   ['IngredientCategory', COMMENT_TAG_NAME]
    type_ids = TagType.where.not(name: ingredient_and_comment_types).pluck(:id)
    grouped_tags = Tag.select(%i[id tag_type_id]).where(tag_type_id: type_ids).
                   map(&:as_json).group_by { |t| t['tag_type_id'] }
    grouped_tags.each_with_object({}) do |(k, v), obj|
      obj[k] = v.map { |t| t['id'] }
    end
  end

  def ingredient_group_hierarchy_filters(current_user)
    ::Graph::TagIndex.instance.family_tags.reduce({}) do |fh, fam|
      child_tags = fam.child_tags_by_user(current_user)
      child_hash = child_tags.reduce({}) do |ch, child|
        ch.merge({ child.id => child.child_tags_by_user(current_user).map(&:id) })
      end
      fh.merge({ fam.id => child_hash })
    end
  end

  def ingreident_recipe_tag_id
    Rails.cache.fetch("#{TAGS}/ingredient_recipe_tag_id", expires_in: 1.year) do
      Tag.where(name: INGREDIENT, tag_type_id: TagType.recipe_type_id).first.id
    end
  end

  def subjective_tags
    TagType.where(name: SUBJECTIVE_TAG_TYPES).flat_map(&:tags)
  end
end
