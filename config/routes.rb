# frozen_string_literal: true

Rails.application.routes.draw do
  devise_scope :user do
    # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
    # stopgap for easy signout from hitting url
    get '/users/sign_out' => 'devise/sessions#destroy'
  end
  devise_for :users
  root to: 'pages#home'
  namespace :api, defaults: { format: :json } do
    resources :recipes, only: %i[create edit index show update]

    resources :tags, only: %i[create index show] do
      resources :recipes, only: %i[index]
    end

    resources :tag_selections, only: %i[create update]
    resources :tag_types, only: %i[index]
  end
  match '/*page' => 'pages#home', via: :get
end
