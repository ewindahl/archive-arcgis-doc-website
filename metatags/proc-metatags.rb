require "middleman-core"
require "pathname"
require "nokogiri"
require "json"

module Metatags
  class << self

    # Called when the metatag extension is activated
    def registered(app, options={})
	
      # Setup extension-specific config
      app.set :config_variable, false

      # Include instance methods
	  app.send :include, MetaInstanceMethods
	  
      app.after_configuration do
        # Do something

        # config_variable is now either the default or the user's
        # setting from config.rb
      end
	  
	  app.helpers do
		def add_meta_tags(fpath)
			
			appname = get_app_name(fpath)
			if appname.empty?
				return
			end
			
			lang = current_language()
			current_meta = get_page_metatags(fpath)
			
			# Force set 'last-modified' date and 'content-language' in 'current_meta'
			current_meta["last-modified"] = Time.now.strftime("%Y-%m-%d")
			current_meta["content-language"] = lang
			
			default_meta = get_default_metatags(lang, appname)
			
			if lang != "en"
				default_meta_en = get_default_metatags("en", appname)
				# merge lang meta to en meta (filling in missing l10n meta with en values)
				default_meta = merge_json(default_meta, default_meta_en)
			end
			
			if (current_meta != nil)
			    if (!current_meta.empty?)
					output_meta = merge_json(current_meta, default_meta)
				end
			else
				output_meta = default_meta
			end
			
			return meta_json2html(output_meta)
		end
	  end

    end
    alias :included :registered
  end
  
  module MetaInstanceMethods
	
	def get_app_name(filepath)
		applist = [
					"arcgis-app",
					"arcgis-online",
					"collector",
					"data-appliance",
					"esri-demographics",
		            "explorer",
				    "geoplanner",
					"location-analytics",
					"maps-for-office",
					"maps-for-sharepoint",
		            "maketplace", 
					"open-data",
					"operations-dashboard",
					"trust",
					"web-appbuilder"
					]
		path = Pathname.new(filepath)
		folders = path.each_filename.to_a
		appname = ""
		if (folders.length > 1) && (applist.include?(folders[1]))
			appname = folders[1]
		end			
		return appname
    end
	
	def current_language
		I18n.locale.to_s
	end
	
	def get_page_metatags(fpath)
		pg_meta = current_page.data.metatags
		if pg_meta
			meta_html = Nokogiri::HTML(pg_meta[0])
		else
			return JSON.parse("{}")
		end
		page_meta_tags = meta_html.xpath("//html/head/meta")
		
		return meta_html2json(page_meta_tags)
	end
	
	def merge_json(from_obj, to_obj)
		# Content of 'from_obj' overwrites content from 'to_obj'
		from_obj.keys.each{ 
			|k| to_obj[k] = from_obj[k]
		}
		return to_obj
	end
	
	def meta_json2html(meta_json)
		meta_html = ""
		meta_json.keys.each{
			|k| meta_html = meta_html + "<meta name='#{k}' content='#{meta_json[k]}'>"
		}
		return meta_html
	end
	
	def meta_html2json(meta_html)
		meta_json = JSON.parse("{}")
		meta_html.each{ 
			|tag| meta_json[tag["name"]] = tag["content"]
		}
		return meta_json		
	end
	
	def get_default_metatags(lang, siteapp)
		# Should always return a json object. Be it empty or not
		curDir = File.dirname(__FILE__)
		en_metaFile = Pathname.new("#{curDir}/en/metatags.xml")
		lang_metaFile = Pathname.new("#{curDir}/#{lang}/metatags.xml")
		
		unless file_exists(en_metaFile)
			puts "ERROR: No metatags.xml file exists by the name #{en_metaFile}. Please create one and rerun middleman build/server"
			return JSON.parse("{}")
		end
		
		unless file_exists(lang_metaFile)
			puts "WARNING: No metatags.xml file exists for the language #{lang}. Defaulting to en"
			lang_metaFile = en_metaFile
		end
		
		doc_meta_xml = xml_from_file(lang_metaFile)
		app_meta_xml = doc_meta_xml.xpath("/metatags/collection[@name='#{siteapp}']/*")
		
		if app_meta_xml.length == 0
			doc_meta_xml = xml_from_file(en_metaFile)
			app_meta_xml = doc_meta_xml.xpath("/metatags/collection[@name='#{siteapp}']/*")
			if app_meta_xml.length == 0
				puts "WARNING: No default metatags exist for #{siteapp} in #{en_metaFile}"
				return JSON.parse("{}")
			end
		end
		
		return meta_xml2json(app_meta_xml)	
	end
	
	def meta_xml2json(meta_xml)
		meta_json = JSON.parse("{}")
		meta_xml.each{ 
			|tag| meta_json[tag["key"]] = tag.text.to_s
		}
		return meta_json
	end
	
	def xml_from_file(lang_metaFile)

		#if defined? xml_data
		#	return xml_data
		#end
		
		meta_xml = File.open(lang_metaFile)
		doc_meta_xml = Nokogiri::XML(meta_xml)
		meta_xml.close
		
		#set :xml_data, doc_meta_xml
		
		return doc_meta_xml
	end
	
	def file_exists(f)
		return File.file?(f)
	end
	
  end

end

# Register extensions which can be activated
# Make sure we have the version of Middleman we expect
::Middleman::Extensions.register(:metatags) do

   # Return the extension module
   ::Metatags

end

