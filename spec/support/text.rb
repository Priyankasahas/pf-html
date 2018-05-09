# frozen_string_literal: true

def parse_ostruct_hash_arrays(definitions)
  raw_key_values = definitions.split("\n")

  raw_key_values.each_with_object({}) do |raw_key_value, m|
    key, value = raw_key_value.split(' => ')
    m[key.tr('"', '')] = parse_ostruct_array(value, '>,')
  end
end

def parse_ostruct_hash(definitions)
  raw_key_values = definitions.split("\n")

  raw_key_values.each_with_object({}) do |raw_key_value, m|
    key, value = raw_key_value.split(' => ')
    m[key.tr('"', '')] = parse_raw_struct(value)
  end
end

def parse_ostruct_array(definitions, sep = "\n")
  raw_structs = definitions.split(sep)

  raw_structs.collect do |raw_struct|
    parse_raw_struct(raw_struct)
  end
end

def parse_raw_struct(definition)
  raw_attributes = definition.strip.gsub(/\[?#<OpenStruct /, '').gsub(/>[,\]],?/, '').split(', ')

  parsed_attributes = raw_attributes.each_with_object({}) do |attribute, m|
    k, v = attribute.split('=')
    m[k] = v.tr('"', '')
  end

  OpenStruct.new(parsed_attributes)
end
