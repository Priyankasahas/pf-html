class Object
  def assign_all(hash)
    hash.each do |key, value|
      send("#{key}=", value)
    end
  end
end
