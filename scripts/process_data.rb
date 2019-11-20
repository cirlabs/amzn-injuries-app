require 'rubygems'
require 'bundler/setup'
require 'pry'


def load_file(filename)
  content = File.open("./data/#{filename}").read
  JSON.parse(content)
end

def save_file(filename, content)
  File.open("./data/#{filename}","w") do |f|
    f.write(content.to_json)
  end
end

def feature_collection(features)
  {
    "type": "FeatureCollection",
    "features": features
  }
end

def fix_val(val)
  return val unless val.is_a? String

  if val == 'TRUE'
    true
  elsif val == 'FALSE'
    false
  elsif val.include?('.') && val.to_f != 0
    val.to_f
  elsif val.to_i != 0
    val.to_i
  else
    val
  end
end

def fix_keys(obj)
  obj.map {|k,v| [@reverse_key_lookup[k], fix_val(v)]}.to_h
end

def to_feature(key, obj)
  lng = obj.delete(@key_lookup['lng'])
  lat = obj.delete(@key_lookup['lat'])
  new_obj = fix_keys(obj)
  new_obj['id'] = key
  {
    "type": "Feature",
    "properties": new_obj,
    "geometry": {
      "type": "Point",
      "coordinates": [lng, lat]
    }
  }
end

def create_geojson(data)
  arr = []
  data.keys.each do |k|
    arr << to_feature(k, data[k])
  end
  arr
end

@key_lookup = load_file('keylookup.json')
@reverse_key_lookup = @key_lookup.map {|k,v| [v,k]}.to_h
data = load_file('amazon.json')
geoJson = feature_collection create_geojson(data)
save_file("incidents.json", geoJson)