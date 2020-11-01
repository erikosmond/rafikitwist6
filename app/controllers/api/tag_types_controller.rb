# frozen_string_literal: true

module Api
  # Controller for recipes and recipes by tag
  class TagTypesController < ApplicationController
    def index
      grouped = params.permit(:grouped)[:grouped]
      if grouped.present?
        render json: TagType.tags_by_type_with_name(current_user&.id.to_i)
      else
        render json: TagType.all
      end
    end
  end
end
