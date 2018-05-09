# frozen_string_literal: true

def json_parse_attribute(selector, attribute_name)
  Hashie::Mash.new(JSON.parse(find(selector)[attribute_name]))
end
