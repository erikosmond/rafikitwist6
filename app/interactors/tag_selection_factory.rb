# frozen_string_literal: true

# class for assigning tags to other tags or recipes
class TagSelectionFactory
  include Interactor

  RATED_TAG = 'Been Made'

  def call
    context.result = case context.action
                     when :create
                       create(context.params)
                     when :update
                       update(context.params)
                     end
  end

  private

    def create(params)
      context.tag_selection = TagSelection.create!(params)
      context.tag_selection_access = AccessService.
                                     create_access!(
                                       context.user.id, context.tag_selection
                                     )
      invoke_side_effects
    end

    def update(params)
      context.tag_selection.tap { |ts| ts.update(params) }
    end

    def invoke_side_effects
      handle_rating
    end

    def handle_rating
      tag = context.tag_selection.tag
      return if tag.tag_type_id != TagType.rating_id

      rated_tag = Tag.find_by_name(RATED_TAG)
      create(taggable: context.tag_selection.taggable, tag: rated_tag)
    end
end
