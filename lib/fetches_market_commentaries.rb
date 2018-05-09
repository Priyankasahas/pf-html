# frozen_string_literal: true

require 'http_client'

class FetchesMarketCommentaries
  def self.fetch(service, grain_type_name)
    connection = HttpClient.new(service)
    response = connection.get "/market_commentaries/#{grain_type_name}"

    response.body.market_commentary do |details|
      m = MarketCommentary.new
      m.assign_all(content: details.content, last_updated_at: details.last_updated_at)
      m
    end
  rescue HttpClient::ClientError => e
    raise e unless e.status == 404 # 404 is missing site, all other codes we pass upstream
  end
end
