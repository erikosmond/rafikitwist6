# frozen_string_literal: true

# Controller parent class
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :configure_permitted_parameters, if: :devise_controller?

  rescue_from Error401 do |_exception|
    render json: {}, status: :unauthorized
  end

  rescue_from Error404 do |_exception|
    render json: {}, status: :not_found
  end

  protected

    def configure_permitted_parameters
      devise_parameter_sanitizer.permit :sign_up, keys:
        %i[
          first_name
          last_name
          email
          password
          password_confirmation
          remember_me
          sign_up_code
        ]
    end
end
