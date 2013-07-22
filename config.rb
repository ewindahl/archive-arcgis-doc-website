# Middleman Config

require "arcgis-framework"

set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'img'
set :fonts_dir, 'fonts'

# Helpers function block
#helpers do

# --- Method to new partial path
#  alias_method(:original_partial, :partial)

#  def partial(path, options = {})
#    new_path = "/" + path.to_s
#    original_partial(new_path.to_sym, options)
#  end

# --- End method of new partial path
#end

activate :directory_indexes


configure :build do
  # Minify CSS on build
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Add a query string cachebuster that will be appended to all assets
  activate :cache_buster

  # Automatically compress PNG images
  # activate :smusher
end
