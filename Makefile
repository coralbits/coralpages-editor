.PHONY: help serve build build_server build_editor


help: 
	@echo "Usage: make <target>"
	@echo "Targets:"
	@echo "  help - Show this help message"
	@echo "  serve - Start the development server"
	@echo "  build - Build the application"

serve:
	npm start


build: build_server build_editor

build_server:
	npm run build

clean:
	rm -rf dist
	rm -rf node_modules
	rm -rf .parcel-cache

setup:
	npm install

