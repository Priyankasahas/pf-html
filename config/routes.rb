Rails.application.routes.draw do
  get '/prices/:bhc_site_name/:bulk_handler_code/:grain_type', to: 'prices#index', as: :prices
end
