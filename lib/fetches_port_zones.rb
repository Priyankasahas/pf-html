# frozen_string_literal: true

require 'http_client'

class FetchesPortZones
  def self.fetch(service)
    connection = HttpClient.new(service)
    response = connection.get '/bhc_sites?type=PortZone'
    response.body.bhc_sites.collect do |details|
      bhc_site = BhcSite.new
      bhc_site.assign_all(details.slice(:id, :name, :bulk_handler_name, :port_name, :type, :pricing_enabled,
                                        :supports_port_zone_averaging, :tradable))
      bhc_site
    end
  rescue HttpClient::ClientError => e
    raise e unless e.status == 404 # 404 is missing site, all other codes we pass upstream
  end
end
