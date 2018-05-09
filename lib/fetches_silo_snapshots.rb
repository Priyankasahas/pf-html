# frozen_string_literal: true

require 'http_client'
require 'fetches_silo_snapshots/response'

module FetchesSiloSnapshots
  def self.fetch(service, bhc_site_name, bulk_handler_code, grain_type)
    connection = HttpClient.new(service)

    response = fetch_prices_snapshots(connection, bhc_site_name, bulk_handler_code, grain_type)

    deserialize_snapshot(Response.new(true), response.body.snapshot)
  rescue HttpClient::ClientError => e
    raise e unless e.status == 404 # 404 is missing site, handler or grain type, all other codes we pass upstream

    error_response(bhc_site_name, bulk_handler_code, grain_type)
  end

  def self.fetch_prices_snapshots(connection, bhc_site_name, bulk_handler_code, grain_type)
    if bulk_handler_code.present?
      url = "/prices?bhc_site_name=#{bhc_site_name.parameterize}&"\
      "bulk_handler_code=#{encode_space(bulk_handler_code)}&grain_type=#{grain_type}"
      connection.get url
    else
      connection.get "/prices?bhc_site_name=#{bhc_site_name.parameterize}&grain_type=#{grain_type}"
    end
  end

  def self.deserialize_snapshot(response, snapshot)
    assign_silo(response, snapshot)

    response.merchant_prices = deserialize_merchant_prices(snapshot.merchant_prices)
    response.market_prices = deserialize_market_prices(snapshot.market_prices)
    response.bin_grades = deserialize_bin_grades(snapshot.bin_grades, response)
    response.grain_types = snapshot.grain_types
    response
  end

  def self.assign_silo(response, snapshot)
    assign_site(response, snapshot)

    response.grain_type_name = snapshot.grain_type_name
    response.grain_season_start_year = snapshot.grain_season_start_year
    response.hero_bin_grade_code = snapshot.hero_bin_grade_code

    assign_metadata(response, snapshot)
  end

  def self.assign_site(response, snapshot)
    response.bhc_site_type = snapshot.bhc_site_type
    response.bhc_site_name = snapshot.bhc_site_name
    response.bhc_site_state = snapshot.bhc_site_state
    response.port_name = snapshot.port_name
    response.freight_rate = snapshot.freight_rate
  end

  def self.assign_metadata(response, snapshot)
    response.bulk_handler_code = snapshot.bulk_handler_code
    response.bulk_handler_name = snapshot.bulk_handler_name
    response.bulk_handler_short_name = snapshot.bulk_handler_short_name
    response.tradable = snapshot.tradable
    response.pricing_label = snapshot.pricing_label
    response.port_equivalent = snapshot.port_equivalent
  end

  def self.deserialize_merchant_prices(content = [])
    content.each_with_object({}) do |(grade, seasons), m|
      m[grade] = seasons.each_with_object({}) do |(season, details), n|
        n[season] = details.collect do |detail|
          m = MerchantPrice.new
          m.assign_all(merchant: detail.merchant, price: detail.price, port_price: detail.port_price,
                       movement: detail.movement, created_at: detail.created_at)
          m
        end
      end
    end
  end

  def self.deserialize_market_prices(content = {})
    content.each_with_object({}) do |(grade, seasons), m|
      m[grade] = seasons.each_with_object({}) do |(season, details), n|
        n[season] = MarketPrice.new
        n[season].assign_all(port_price: details.port_price,
                             price: details.price,
                             price_high_movement: details.price_high_movement,
                             prices_last_updated_at: details.prices_last_updated_at)
        n[season]
      end
    end
  end

  def self.deserialize_bin_grades(content = [], response)
    content.each_with_object([]).each do |details, m|
      b = BinGrade.new
      b.assign_all(code: details.code,
                   description: details.description,
                   seasons: response.market_prices[details.code].keys)
      m << b
    end
  end

  def self.error_response(bhc_site_name, bulk_handler_code, grain_type)
    response = Response.new(false)
    response.bhc_site_name = bhc_site_name
    response.bulk_handler_code = bulk_handler_code
    response.grain_type_name = grain_type
    response
  end

  def self.encode_space(string)
    URI.escape(string)
  end

  private_class_method :fetch_prices_snapshots, :deserialize_snapshot, :assign_silo, :assign_metadata
  private_class_method :deserialize_merchant_prices, :deserialize_market_prices, :deserialize_bin_grades, :encode_space
end
