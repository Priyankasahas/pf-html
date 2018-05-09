# frozen_string_literal: true

require 'http_client'

class FetchesPricingDescriptions
  def self.fetch(service, bhc_site_name)
    connection = HttpClient.new(service)
    response = connection.get "/pricing_descriptions/#{bhc_site_name.parameterize}"

    response.body.pricing_description do |details|
      p = PricingDescription.new
      p.assign_all(name: details.name, description: details.description)
      p
    end
  rescue HttpClient::ClientError => e
    raise e unless e.status == 404 # 404 is missing site, all other codes we pass upstream
  end
end
