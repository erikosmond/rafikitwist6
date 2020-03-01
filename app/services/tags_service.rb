# frozen_string_literal: true

# methods mostly used to build tag heirarchy to populate filtering component.
module TagsService
  COMMENT_TAG_NAME = 'Comment'

  def comment_tag
    tag = Tag.find_or_initialize_by(name: COMMENT_TAG_NAME)
    return tag if tag.persisted?

    tag_type = TagType.find_or_create_by(name: COMMENT_TAG_NAME)
    tag.tag_type = tag_type
    tag.tap(&:save).reload
  end

  def all_tags_with_hierarchy(current_user)
    tag = Tag.first
    all_tags = true
    tag.tag_with_hierarchy(current_user, all_tags)
  end

  def all_family_tags_with_hierarchy(current_user)
    all_tags_with_hierarchy(current_user).where(tag_type: TagType.family_id)
  end

  def grandparent_tags_with_grouped_children(hierarchy)
    all_families = []
    current_family = nil
    current_type = nil
    current_ingredient = nil
    hierarchy.each do |result|
      if current_family&.id != result.tag_id
        ing_family = Tag.new(name: result.tag_name, id: result.tag_id, tag_type_id: TagType.family_id)
        current_family = ing_family
        all_families << current_family
      end
      if current_type&.id != result.child_tag_id
        ing_type = ChildTag.new(name: result.child_tag_name, id: result.child_tag_id, tag_type_id: TagType.type_id)
        current_family.child_tags << ing_type
        current_type = ing_type
      end
      next if current_ingredient&.id == result.grandchild_tag_id

      ingredient = ChildTag.new(name: result.grandchild_tag_name, id: result.grandchild_tag_id, tag_type_id: TagType.ingredient_id)
      current_type.child_tags << ingredient
      current_ingredient = ingredient
    end
    all_families
  end

  def tags_by_type
    # TODO: either remove COMMENT_TAG_NAME from the list or update the name of the var
    ingredient_types = TagType::INGREDIENT_TYPES + ['IngredientCategory', COMMENT_TAG_NAME]
    type_ids = TagType.where.not(name: ingredient_types).pluck(:id)
    grouped_tags = Tag.select(%i[id tag_type_id]).where(tag_type_id: type_ids).
                   map(&:as_json).group_by { |t| t['tag_type_id'] }
    grouped_tags.each_with_object({}) do |(k, v), obj|
      obj[k] = v.map { |t| t['id'] }
    end
  end

  def group_grandparent_hierarchy_by_id(model_groups)
    model_groups.each_with_object({}) do |family, family_hash|
      family_hash[family.id] = family.child_tags.each_with_object({}) do |type, type_hash|
        type_hash[type.id] = type.child_tags.map(&:id).reject(&:blank?) if type&.id
      end
    end
  end

  def ingredient_group_hierarchy_filters(current_user)
    hierarchy = all_family_tags_with_hierarchy(current_user)
    groups = grandparent_tags_with_grouped_children(hierarchy)
    group_grandparent_hierarchy_by_id(groups.sort_by(&:name))
  end
end
