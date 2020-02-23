# frozen_string_literal: true
 
Rails.application.routes.draw do
  devise_scope :user do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
     get '/users/sign_out' => 'devise/sessions#destroy' # stopgap for easy signout from hitting url
  end
  devise_for :users
  authenticate :user do
    root to: 'pages#home'
    namespace :api, defaults: { format: :json } do
      resources :recipes, only: %i[index show]
 
      resources :tags, only: %i[index show] do
        resources :recipes, only: %i[index]
      end
 
      resources :tag_selections, only: %i[create update]
    end
    match '/*page' => 'pages#home', via: :get
  end
end
