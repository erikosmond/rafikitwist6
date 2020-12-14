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

  def all_tags_with_hierarchy(current_user)
    tag = Tag.first
    tag.tag_with_hierarchy(current_user, all_tags: true)
  end

  def all_family_tags_with_hierarchy(current_user)
    all_tags_with_hierarchy(current_user).where(tag_type: TagType.family_id)
  end

  def grandparent_tags_with_grouped_children(hierarchy)
    families = []
    hierarchy.each do |h|
      new_family, new_type, new_ingredient =
        build_heirarchy(families, @current_family, @current_type, @current_ingredient, h)
      @current_ingredient = new_ingredient || @current_ingredient
      @current_type = new_type || @current_type
      @current_family = new_family || @current_family
    end
    families
  end

  def build_heirarchy(families, current_family, current_type, current_ingredient, result)
    if current_family&.id != result.tag_id
      families << current_family = new_family_tag(result)
    end
    if current_type&.id != result.child_tag_id
      current_family.child_tags << current_type = new_type_tag(result)
    end
    return if current_ingredient&.id == result.grandchild_tag_id

    current_type.child_tags << current_ingredient = new_ingredient_tag(result)
    [current_family, current_type, current_ingredient]
  end

  def tags_by_type
    ingredient_and_comment_types = TagType::INGREDIENT_TYPES +
                                   ['IngredientCategory', COMMENT_TAG_NAME]
    type_ids = TagType.where.not(name: ingredient_and_comment_types).pluck(:id)
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

  def new_family_tag(result)
    Tag.new(name: result.tag_name, id: result.tag_id, tag_type_id: TagType.family_id)
  end

  def new_type_tag(result)
    ChildTag.new(
      name: result.child_tag_name,
      id: result.child_tag_id,
      tag_type_id: TagType.type_id
    )
  end

  def new_ingredient_tag(result)
    ChildTag.new(
      name: result.grandchild_tag_name,
      id: result.grandchild_tag_id,
      tag_type_id: TagType.ingredient_id
    )
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
