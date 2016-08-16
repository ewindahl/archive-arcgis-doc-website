require 'net/http'
require 'uri'
require 'date'
require 'fileutils'


def create_directory(dirname)
  unless Dir.exists?(dirname)
    Dir.mkdir(dirname)
  else
    puts "Skipping creating directory " + dirname + ". It already exists."
  end
end

def read_uris_from_file(file)
  uris = Array.new
  File.open(file).each do |line|
    line = line.strip
    next if line == nil || line.length == 0
    parts = line.split(' ')
    pair = Hash[ [:resource, :filename].zip(parts) ]
    uris.push(pair)
  end
  uris
end

def download_resource(resource, filename)
  uri = URI.parse(resource)
  case uri.scheme.downcase
  when /http|https/
    http_download_uri(uri, filename)
  else
    puts "Unsupported URI scheme for resource " + resource + "."
  end
end

def http_download_uri(uri, filename)
  puts "Starting HTTP download for: " + uri.to_s
  http_object = Net::HTTP.new(uri.host, uri.port)
  http_object.use_ssl = true if uri.scheme == 'https'
  begin
    http_object.start do |http|
      request = Net::HTTP::Get.new uri.request_uri
      http.read_timeout = 500
      http.request request do |response|
        open filename, 'w' do |io|
          response.read_body do |chunk|
            io.write chunk
          end
        end
      end
    end
  rescue Exception => e
    puts "=> Exception: '#{e}'. Skipping download."
    return
  end
  puts "Stored download as " + filename + "."
end


def download_resources(pairs)
  pairs.each do |pair|
    filename = pair[:filename].to_s
    resource = pair[:resource].to_s
    unless File.exists?(filename)
      download_resource(resource, filename)
    else
      puts "Skipping download for " + filename + ". It already exists."
    end
  end
end

def download_sources()
  Net::HTTP.start("docdev.arcgis.com") { |http|
    resp = http.get("/cdn/sources.txt")
    open("sources.txt", "wb") { |file|
      file.write(resp.body)
    }
  }
end

def build_dir_structure()
  create_directory("source/cdn/css")
  create_directory("source/cdn/js")
  create_directory("source/cdn/js/libs")
end

def clean_cdn_dir(cleandir)
  puts "Cleaning the CDN directory for new files"
  FileUtils.rm_rf cleandir
end

def main
  download_sources()
  sources_file = "sources.txt"
  uris = read_uris_from_file(sources_file)

  target_dir_name = "source/cdn"
  clean_cdn_dir(target_dir_name)
  create_directory(target_dir_name)
  build_dir_structure()
  Dir.chdir(target_dir_name)
  puts "Changed directory: " + Dir.pwd

  download_resources(uris)
end


if __FILE__ == $0
  usage = <<-EOU

usage: ruby #{File.basename($0)}

  The file sources.txt should contain an URL and the target file name.
  The expected file format is:

  http://www.domain.com/file target_file_name
  ftp://www.domain.com/file target_file_name

  EOU

  # abort usage if ARGV.length != 1

  main

end
