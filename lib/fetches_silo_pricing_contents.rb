# frozen_string_literal: true

require 'services_url_loader'
require 'fetches_silo_snapshots'
require 'fetches_pricing_descriptions'
require 'fetches_market_commentaries'

class FetchesSiloPricingContents
  extend ServicesUrlLoader
  class Response
    attr_reader :pricing_description, :snapshot, :market_commentary
    delegate :valid?, to: :snapshot
    delegate :formatted_error, to: :snapshot

    def initialize(snapshot, pricing_description, market_commentary)
      @snapshot = snapshot
      @pricing_description = pricing_description
      @market_commentary = market_commentary
    end
  end

  def self.fetch(bhc_site_name, bulk_handler_code, grain_type_name)
    snapshot = FetchesSiloSnapshots.fetch(prices_service_url, bhc_site_name, bulk_handler_code, grain_type_name)
    pricing_description = snapshot.valid? ? FetchesPricingDescriptions.fetch(prices_service_url, bhc_site_name) : nil
    market_commentary = snapshot.valid? ? FetchesMarketCommentaries.fetch(prices_service_url, grain_type_name) : nil

    Response.new(snapshot, pricing_description, market_commentary)
  end
end
