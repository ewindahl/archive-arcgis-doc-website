# Middleman Config
require "arcgis-framework"
require "metatags/proc-metatags"

activate :i18n, :mount_at_root => false
activate :directory_indexes
activate :metatags

set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'img'
set :fonts_dir, 'fonts'

# Helpers function block
helpers do

  alias_method :original_partial, :partial

  def partial(path, options = {})
      new_path = "localizable/" + path.to_s
      original_partial(new_path.to_sym, options)
  end

  def t key
    I18n.t key
  end

  def current_language
    I18n.locale.to_s
  end
end


#Folder specific layout
#page "/es/*", :layout => "es"
#page "/en/marketplace/*", :layout => "marketplace/layout"

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
