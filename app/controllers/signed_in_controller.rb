# frozen_string_literal: true

require 'fetches_overnight_moves'

class SignedInController < ApplicationController
  # before_action :subscriber_notifications
  before_action :overnight_markets

  layout 'private'

  def exchange_unavailable_redirect
    flash[:error] = 'Clear Grain Exchange is currently unavailable.
    Please email us on support@cleargrain.com.au or contact us on 1800 000 410.
    We will be happy to assist with any questions.'
    redirect_to root_path
  end

  private

  def overnight_markets
    @market_overnight_move = FetchesOvernightMoves.fetch(prices_service_url)
  end

  # def subscriber_notifications
  #   @subscriber_notifications = FetchesSubscriberNotifications.fetch(subscribers_service_url,
  #                                                                    current_subscriber).subscriber_notifications
  #   @has_unread_notifications = @subscriber_notifications.any?(&:is_unread)
  # end
end
