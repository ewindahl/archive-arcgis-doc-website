require "middleman-core"



module Download
  class << self

    # Called when trial extension activated
    def registered(app, options={})
	
      # Setup extension-specific config
      app.set :config_variable, false
	  
	  
	  app.helpers do


	  	def getAttrData(product,dataAttr)

	  		if data.downloads[current_language]
				prodObj = data.downloads[current_language]
			else
				prodObj = data.downloads['en']
			end
	
			explodedStr = product.split("~")

			if explodedStr.length > 0
				explodedStr.each{|k,v|
					prodObj = prodObj.send(k.to_sym) ? prodObj.send(k.to_sym) : false
					if not prodObj
						break
					end
				}
			end


			retValue = (prodObj and prodObj.send(dataAttr.to_sym)) ? prodObj.send(dataAttr.to_sym) : ""
			#retValue = prodObj.send(dataAttr.to_sym) ? prodObj.send(product.to_sym).send(dataAttr.to_sym) : ""

			return retValue
		end

		def isMultiVersions (prodObj)
			return (prodObj.send("versions".to_sym) and prodObj.send("versions".to_sym).count() > 1) ? true : false
		end


		def generateVersionDropDown (dataPath)
			if data.downloads[current_language]
				prodObj = data.downloads[current_language]
			else
				prodObj = data.downloads['en']
			end

			explodedStr = dataPath.split("~")
			appDownloadType = explodedStr[3]

			if explodedStr.length > 0
				explodedStr.each{|k,v|
					prodObj = prodObj.send(k.to_sym) ? prodObj.send(k.to_sym) : false
					if not prodObj
						break
					end
				}
			end

			retValue = ""
			if isMultiVersions(prodObj)
				retValue = "<div class='dropdown-wrapper '>
                          Version <span class='dropdown dropdown-selected' filename='' foldername='' href='#'></span>
                          <div class='dropdown-content'>
                            <div class='dropdown-menu'>
				<ul>"
				#if isMultiVersions(prodObj) == true
				prodObj.send("versions".to_sym).each {|k,v|
					fileSize = v['filesize'] ? v['filesize'] : "&nbsp;" 
					retValue = retValue + '<li><a href="#" class="dropdown-item" data-file-size="' + fileSize + '" data-app-folder="' + v['foldername'] + '" data-app-file="' + v['filename'] + '">' + k.to_s + '</a></li>'
				}
				retValue = retValue + "</ul>
				</div></div></div>
				<a class='btn orange download-link' data-folder='' data-filename=''>Download</a>"
			else
				prodObj.send("versions".to_sym).each {|k,v|
					fileSize = v['filesize'] ? v['filesize'] : "&nbsp;" 
					retValue = retValue + '
					Version <span class="dropdown dropdown-selected" filename="" foldername="" href="#">' + k.to_s + '</span><br/>
					<a href="#" class="btn orange download-link" data-file-size="' + fileSize + '" data-folder="' + v['foldername'] + '" data-filename="' + v['filename'] + '">Download</a>'
				}
			end



			return retValue
		end


		def getExtensionNames (extensions,type)
			names = ""

			extensions.each {|k,v|
				names = names + ',' + k + '-' + v[type]
			}
			return names

		end
		
	  end

    end
    alias :included :registered
  end
end

# Register extensions which can be activated
# Make sure we have the version of Middleman we expect
::Middleman::Extensions.register(:download) do

   # Return the extension module
   ::Download

end