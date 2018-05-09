# frozen_string_literal: true

module FetchesSiloSnapshots
  Response = Struct.new(:valid?, :bhc_site_name, :port_name, :bulk_handler_code,
                        :grain_type_name, :grain_season_start_year, :merchant_prices, :market_prices,
                        :bin_grades, :grain_types, :hero_bin_grade_code, :bhc_site_type,
                        :tradable, :pricing_label, :port_equivalent,
                        :bulk_handler_name, :bulk_handler_short_name, :freight_rate, :bhc_site_state)
  class Response
    def formatted_error
      if bhc_site_name && bulk_handler_code && grain_type_name
        'No prices currently available for ' \
        "#{bhc_site_name} (#{bulk_handler_code}), #{grain_type_name}"
      else
        given_values = [bhc_site_name, bulk_handler_code, grain_type_name].compact.join(', ')
        "No prices currently available for the specified attributes (#{given_values})"
      end
    end

    def tradable?
      tradable
    end
  end
end
