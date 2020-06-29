# frozen_string_literal: true

# For showing a tag's given (grand)child_tags and (grand)parent_tags
class BuildTagHierarchy
  include Interactor

  def call
    hierarchy = Tag.
                select(tag_hierarchy_select).
                left_outer_joins(tag_hierarchy_join).
                where(accesses_predicate).
                order('tags.id, child_tags.id, child_tags_tags.id')

    context.tags_with_hierarchy = filter_tags(hierarchy)

    context.sister_tags = sister_tags
  end

  private

    def sister_tags
      sisters = context.tag.parent_tags.flat_map(&:child_tags)
      sisters.reject! { |s| s.id == context.tag.id }
      accessible_sisters = TagSelection.joins(:access).where(tag_id: sisters.pluck(:id)).
                           where(accesses_predicate).includes(:tag)
      tags = accessible_sisters.first ? accessible_sisters&.map(&:tag) : friends
      tags.reject { |t| TagType.ingredient_category_id == t.tag_type_id }
    end

    def friends
      return [] if context.tag.tag_type_id == TagType.ingredient_id

      friends = context.tag.tag_type.tags.reject { |f| f.id == context.tag.id }
      accessible_friends = TagSelection.joins(:access).where(tag_id: friends.pluck(:id)).
                           where(accesses_predicate).includes(:tag)
      accessible_friends.first ? accessible_friends.map(&:tag) : []
    end

    def filter_tags(hierarchy)
      if context.all_tags
        hierarchy
      else
        hierarchy.where(tags: { id: context.tag.id })
      end
    end

    def tag_hierarchy_select
      cols = tag_hierarchy_select_children + tag_hierarchy_select_parents +
             [
               'tags.id tag_id',
               'tags.name tag_name',
               'tag_types.id tag_type_id',
               'modifications_tag_selections.id modification_tag_id',
               'modifications_tag_selections.name modification_tag_name'
             ]
      cols << tag_hierarchy_select_modified if modification_tag?
      cols
    end

    def tag_hierarchy_select_modified
      [
        'modified_tags_tags.id modified_tag_id',
        'modified_tags_tags.name modified_tag_name'
      ]
    end

    def tag_hierarchy_select_children
      [
        'child_tags.id child_tag_id',
        'child_tags.name child_tag_name',
        'child_tags_tags.id grandchild_tag_id',
        'child_tags_tags.name grandchild_tag_name'
      ]
    end

    def tag_hierarchy_select_parents
      [
        'parent_tags_tags.id parent_tag_id',
        'parent_tags_tags.name parent_tag_name',
        'parent_tags_tags_2.id grandparent_tag_id',
        'parent_tags_tags_2.name grandparent_tag_name'
      ]
    end

    def accesses_predicate
      if ingredient_tag?
        ''
      else
        "accesses.user_id = #{context.current_user&.id.to_i} OR accesses.status = 'PUBLIC'"
      end
    end

    def child_tag_joins
      ingredient_tag? ? { tag: :child_tags } : [:access, { tag: :child_tags }]
    end

    def tag_hierarchy_join
      join_tables = [
        :tag_type,
        child_tag_selections: child_tag_joins,
        parent_tags: :parent_tags,
        tag_selections: :modifications
      ]
      join_tables << :modified_tags if modification_tag?
      join_tables
    end

    def modification_tag?
      context.tag.tag_type_id == TagType.modification_id
    end

    def ingredient_tag?
      context.tag.tag_type_id == TagType.ingredient_id
    end
end
