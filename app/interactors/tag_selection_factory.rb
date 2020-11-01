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
                                       context.user&.id.to_i, context.tag_selection
                                     )
      invoke_side_effects
    end

    def find_or_create(params)
      string_params = {
        'tag_id' => params[:tag].id,
        'taggable_type' => params[:taggable].class.name,
        'taggable_id' => params[:taggable].id
      }
      create(string_params) unless TagSelection.joins(:access).where(
        tag: params[:tag], taggable: params[:taggable]
      ).where(accesses: { user_id: context.user&.id.to_i }).first
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
      find_or_create(taggable: context.tag_selection.taggable, tag: rated_tag)
    end
end
