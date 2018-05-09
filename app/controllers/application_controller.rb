# frozen_string_literal: true

require 'service'
require 'services_url_loader'

class ApplicationController < ActionController::Base
  include ServicesUrlLoader
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery

  helper_method :deparameterize
  helper_method :clear_grain_service_url, :orders_service_url, :fast_cash_service_url,
                :subscribers_service_url, :prices_service_url

  protected

  def deparameterize(string)
    return nil unless string

    string.tr('-', ' ').strip.titleize
  end
end
