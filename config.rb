# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :sprockets
activate :asset_hash
# activate :google_drive, load_sheets: '1GjVjJ-ilYk1TNO9s3bgJzh90ixPQB7KI8QG4dPDEAmM'
# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

helpers do
  def searchList
    state_group = data.incidents.features
      .group_by { |d| d.properties.state }
      .map { |k, v| [k, v.map { |x| x.properties.id }] }.to_h

    zip_group = data.incidents.features
      .group_by { |d| d.properties['zip'] }
      .map { |k, v| [k, v.map { |x| x.properties.id }] }.to_h

    city_group = data.incidents.features
      .group_by { |d| d.properties.city }
      .map { |k, v| [k, v.map { |x| x.properties.id }] }.to_h

    main_hash = data.incidents.features
        .map { |d| [d.properties.id, d.properties.id] }.to_h
    # data.incidents.features.map do |d|
    #   props = d.properties
    #   {
    #     searchTerms: [props.id, props.city + ', ' + props.state, props['zip']].join(' '),
    #     display: props.id + '-' + props.city + ', ' + props.state,
    #     value: props.id
    #   }
    # end
    main_hash.merge! state_group
    main_hash.merge! zip_group
    main_hash.merge! city_group
    main_hash
  end
end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

configure :build do
  activate :minify_css
  # activate :minify_javascript
  activate :asset_host, :host => '//apps.revealnews.org/amazon-injuries/'
end
