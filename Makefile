.PHONY: help serve build


help: 
	@echo "Usage: make <target>"
	@echo "Targets:"
	@echo "  help - Show this help message"
	@echo "  serve - Start the development server"
	@echo "  build - Build the application"

serve:
	npm start


build:
	npm run build

clean:
	rm -rf dist
	rm -rf node_modules
	rm -rf .parcel-cache

setup:
	npm install



