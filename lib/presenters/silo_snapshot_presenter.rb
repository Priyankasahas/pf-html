# frozen_string_literal: true

module Presenters
  class SiloSnapshotPresenter
    attr_reader :snapshot, :pricing_description, :market_commentary

    %w[bhc_site_name bhc_site_state port_name bulk_handler_code grain_type_name
       grain_season_start_year merchant_prices market_prices
       bin_grades grain_types hero_bin_grade_code bhc_site_type
       tradable? pricing_label port_equivalent bulk_handler_name bulk_handler_short_name
       freight_rate].each do |delegatee|
      delegate delegatee, to: :snapshot
    end

    def initialize(pricing_contents)
      @snapshot = pricing_contents.snapshot
      @pricing_description = pricing_contents.pricing_description
      @market_commentary = pricing_contents.market_commentary
    end

    def default_bin_grade_code
      bin_grades.first.code
    end

    def default_grain_season_start_year
      available_seasons = market_prices[default_bin_grade_code].keys.sort
      available_seasons.include?(grain_season_start_year.to_s) ? grain_season_start_year : available_seasons.first
    end

    def formatted_silo_name
      "#{grain_type_name} - #{bhc_site_name} - #{bulk_handler_code}".html_safe
    end

    def formatted_for_json_free
      {
        bhc_site_name: bhc_site_name, port_name: port_name,
        grain_type_name: grain_type_name, grain_season_start_year: grain_season_start_year,
        bulk_handler_code: bulk_handler_code, bulk_handler_name: bulk_handler_name,
        bulk_handler_short_name: bulk_handler_short_name,
        market_prices: market_prices,
        bin_grades: bin_grades, grain_types: grain_types,
        hero_bin_grade_code: hero_bin_grade_code, freight_rate: freight_rate
      }
    end

    def formatted_for_json_paid
      formatted_for_json_free.merge!(merchant_prices: merchant_prices)
    end

    def commentary_formatted_for_json
      {
        content: @market_commentary.content,
        last_updated_at: @market_commentary.last_updated_at
      }
    end
  end
end
